const ethers = require("ethers");
const dotenv = require("dotenv").config();
const hubAbi = require("./abi/hubAbi.json");
const factoryAbi = require("./abi/factoryAbi.json");
const forbiddenAbi = require("./abi/forbiddenAbi.json");

const main = async () => {
  const hubAddress = "0x5d64B9ef639fecBC755C622C094B3A8A8dbF18A2";
  const factoryAddress = "0x5e9b4433F2087cC526205c85a801D675a499AF49";
  const sbtFactoryAddress = "0xeF1d6F4bbBbC67FdbE553309cE6a062A193481Bb";
  const forbiddenTldsAddress = "0x20FC0BCb329E0545c34e9dAfDBD27700EfEc81eB";
  const metaDataAddress = "0xea828d703DE8e98109FE2d1358Ab92b1E55bDCb4";
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTP_ENDPOINT
  );
  const wallet = new ethers.Wallet.fromMnemonic(process.env.PHARSE);

  // const hubAddress = "0x4EE6eCAD1c2Dae9f525404De8555724e3c35d07B";
  // const factoryAddress = "0xD84379CEae14AA33C123Af12424A37803F885889";
  // const sbtFactoryAddress = "0xC9a43158891282A2B1475592D5719c001986Aaec";
  // const forbiddenTldsAddress = "0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25";
  // const metaDataAddress = "0x5E8Ef50EAF2237E037217298341458C66cC4836F";

  // //const privateKey = process.env.PRIVATE_KEY;

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://127.0.0.1:8545"
  // );
  // //wallet from private key
  // const wallet = new ethers.Wallet(
  //   "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  //   provider
  // );
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
    ".weed",
    "3rd",
    "0xfFD7E682420eD0d3f6b9cf714e86FE48d89b1c7b",
    0,
    true
  );
  const recipt = await createDomain.wait();
  console.log("createDomain: ", await createDomain.hash);
  console.log("recipt: ", recipt);

  const createSbtDoamin = await picardySBTFactory.createTld(
    ".garden",
    "gr",
    "0xfFD7E682420eD0d3f6b9cf714e86FE48d89b1c7b",
    0,
    true
  );
  const recipt1 = await createSbtDoamin.wait();
  console.log("createSbtDoamin: ", await createSbtDoamin.hash);
  console.log("recipt1: ", recipt1);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
