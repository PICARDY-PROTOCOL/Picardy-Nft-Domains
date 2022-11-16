const ethers = require("ethers");
const dotenv = require("dotenv").config();
const hubAbi = require("./abi/hubAbi.json");
const factoryAbi = require("./abi/factoryAbi.json");
const forbiddenAbi = require("./abi/forbiddenAbi.json");

const main = async () => {
  const hubAddress = "0x718cFF78Fa43615cDF1c43415b9C7A63c8cA9814";
  const factoryAddress = "0x311F7f66f35BA7242F1FE5ae0d45eD51145Fa688";
  const sbtFactoryAddress = "0x71D60c6E3723a4a9Cc351cC28Cd2C818Bf19e2D2";
  const forbiddenTldsAddress = "0x37DbCC4f8D5672Ae624d1c92d53a700790009a5E";
  const metaDataAddress = "0x5E8Ef50EAF2237E037217298341458C66cC4836F";
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTP_ENDPOINT
  );
  // const wallet = new ethers.Wallet.fromMnemonic(process.env.PHARSE);

  // const hubAddress = "0x809d550fca64d94Bd9F66E60752A544199cfAC3D";
  // const factoryAddress = "0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3";
  // const sbtFactoryAddress = "0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc";
  // const forbiddenTldsAddress = "0x82e01223d51Eb87e16A03E24687EDF0F294da6f1";
  // const metaDataAddress = "0x5E8Ef50EAF2237E037217298341458C66cC4836F";

  const privateKey = process.env.PRIVATE_KEY;

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://127.0.0.1:8545"
  // );
  //wallet from private key
  const wallet = new ethers.Wallet(privateKey, provider);
  const account = wallet.connect(provider);
  console.log("wallet address: ", account.address);

  //const hub = new ethers.Contract(hubAddress, hubAbi, account);
  //const addFactory = await hub.addFactory(factoryAddress);

  const picardyFactory = new ethers.Contract(
    factoryAddress,
    factoryAbi,
    account
  );

  const picardySBTFactory = new ethers.Contract(
    sbtFactoryAddress,
    factoryAbi,
    account
  );

  // const forbiddenTlds = new ethers.Contract(
  //   forbiddenTldsAddress,
  //   forbiddenAbi,
  //   account
  // );

  // const txr = await forbiddenTlds.addFactoryAddress(factoryAddress);
  // await txr.wait(2);

  // const tx = await picardyFactory.toggleBuyingTlds();
  // await tx.wait();
  // console.log("toggleBuyingTlds: ", await tx.hash);

  const createDomain = await picardyFactory.createTld(
    ".blokness",
    "BLKN",
    "0xfFD7E682420eD0d3f6b9cf714e86FE48d89b1c7b",
    0,
    true
  );
  const recipt = await createDomain.wait();
  console.log("createDomain: ", await createDomain.hash);
  //console.log("recipt: ", recipt);

  const createSbtDoamin = await picardySBTFactory.createTld(
    ".picardy",
    ".3rd",
    "0xfFD7E682420eD0d3f6b9cf714e86FE48d89b1c7b",
    0,
    true
  );
  const recipt1 = await createSbtDoamin.wait();
  console.log("createSbtDoamin: ", await createSbtDoamin.hash);
  //console.log("recipt1: ", recipt1);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
