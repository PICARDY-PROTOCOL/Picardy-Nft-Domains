// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  //Import contracts to deploy
  const PicardyDomainFactory = await hre.ethers.getContractFactory(
    "PicardyDomainFactoryV2"
  );

  const picardyDomainSBTFactory = await hre.ethers.getContractFactory(
    "PicardyDomainSBTFactory"
  );

  const PicardyDomainHub = await hre.ethers.getContractFactory(
    "PicardyDomainHub"
  );

  const PicardyDomainResolver = await hre.ethers.getContractFactory(
    "PicardyDomainResolver"
  );

  const PicardySBTDomainResolver = await hre.ethers.getContractFactory(
    "PicardySBTDomainResolver"
  );

  const ForbiddenTlds = await hre.ethers.getContractFactory("ForbiddenTldsV2");

  const metadataAddress = "0xea828d703DE8e98109FE2d1358Ab92b1E55bDCb4";

  const royaltyAddress = "0xfFD7E682420eD0d3f6b9cf714e86FE48d89b1c7b";

  const picardyHub = await PicardyDomainHub.deploy(metadataAddress);
  await picardyHub.deployed();
  const hubAddress = picardyHub.address;

  const picardyResolver = await upgrades.deployProxy(PicardyDomainResolver);
  const domainSbtResolver = await upgrades.deployProxy(
    PicardySBTDomainResolver
  );
  await picardyResolver.deployed();
  await domainSbtResolver.deployed();
  const resolverAddress = picardyResolver.address;
  const domainSbtResolverAddress = domainSbtResolver.address;
  console.log("resolver Address:", resolverAddress);
  console.log("domain Sbt resolver address:", domainSbtResolverAddress);

  await picardyResolver.addHubAddress(hubAddress, { gasLimit: 1000000 });
  await domainSbtResolver.addHubAddress(hubAddress, { gasLimit: 1000000 });

  const forbiddenTlds = await ForbiddenTlds.deploy(hubAddress);
  await forbiddenTlds.deployed();
  const forbiddenTldsAddress = forbiddenTlds.address;

  const picardyFactory = await PicardyDomainFactory.deploy(
    0,
    forbiddenTldsAddress,
    metadataAddress,
    hubAddress,
    royaltyAddress
  );
  await picardyFactory.deployed();
  const factoryAddress = picardyFactory.address;

  await picardyResolver.addFactoryAddress(factoryAddress);

  await forbiddenTlds.addFactoryAddress(factoryAddress);

  const init = await picardyHub.init(
    picardyFactory.address,
    forbiddenTldsAddress
  );
  await init.wait();

  const toogle = await picardyFactory.toggleBuyingTlds();
  await toogle.wait();

  console.log("picardyDomainHub deployed to: ", hubAddress);
  console.log("picardyDomainFactory deployed to: ", factoryAddress);
  console.log("forbiddenTlds deployed to: ", forbiddenTldsAddress);

  const picardySBTFactory = await picardyDomainSBTFactory.deploy(
    0,
    forbiddenTldsAddress,
    metadataAddress,
    hubAddress,
    royaltyAddress
  );
  await picardySBTFactory.deployed();
  const sbtFactoryAddress = picardySBTFactory.address;
  await domainSbtResolver.addFactoryAddress(sbtFactoryAddress);

  console.log("picardyDomainSBTFactory deployed to: ", sbtFactoryAddress);

  await forbiddenTlds.addFactoryAddress(sbtFactoryAddress);

  const sbtInit = await picardyHub.initSBT(picardySBTFactory.address);
  await sbtInit.wait();

  const sbtToogle = await picardySBTFactory.toggleBuyingTlds();
  await sbtToogle.wait();

  // Deployed to mumbai testnet
  // resolver Address: 0x557ad8C374aE2663AF6db3d2cD4C42f79FcF0324
  // domain Sbt resolver address: 0xc7b63c3F1212E063C386a2C05A171Db3217A99Ab
  // picardyDomainHub deployed to:  0x718cFF78Fa43615cDF1c43415b9C7A63c8cA9814
  // picardyDomainFactory deployed to:  0x311F7f66f35BA7242F1FE5ae0d45eD51145Fa688
  // forbiddenTlds deployed to:  0x37DbCC4f8D5672Ae624d1c92d53a700790009a5E
  // picardyDomainSBTFactory deployed to:  0x71D60c6E3723a4a9Cc351cC28Cd2C818Bf19e2D2
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
