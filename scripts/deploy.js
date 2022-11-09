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

  const ForbiddenTlds = await hre.ethers.getContractFactory("ForbiddenTldsV2");

  const metadataAddress = "0xea828d703DE8e98109FE2d1358Ab92b1E55bDCb4";

  const royaltyAddress = "0xfFD7E682420eD0d3f6b9cf714e86FE48d89b1c7b";

  const picardyHub = await PicardyDomainHub.deploy(metadataAddress);
  await picardyHub.deployed();
  const hubAddress = picardyHub.address;

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

  console.log("picardyDomainSBTFactory deployed to: ", sbtFactoryAddress);

  await forbiddenTlds.addFactoryAddress(sbtFactoryAddress);

  const sbtInit = await picardyHub.initSBT(picardySBTFactory.address);
  await sbtInit.wait();

  const sbtToogle = await picardySBTFactory.toggleBuyingTlds();
  await sbtToogle.wait();

  // Deployed to mumbai testnet
  // picardyDomainHub deployed to:  0x519D7D7e78648FADAA9274a4d41E62C52DE0A293
  // picardyDomainFactory deployed to:  0x6F098901161eE4dE9a584A17A93fFBfB40545144
  // forbiddenTlds deployed to:  0x165bAAd4C6d924CfD4C36186E3B0f4DBbF3233dF
  // picardyDomainSBTFactory deployed to:  0xF6D2F3F90E29D7f6Af7e4A72C1EF5394650Dc65D
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
