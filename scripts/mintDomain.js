const ethers = require("ethers");
const dotenv = require("dotenv").config();
const hubAbi = require("./abi/hubAbi.json");
const factoryAbi = require("./abi/factoryAbi.json");
const forbiddenAbi = require("./abi/forbiddenAbi.json");
const sbtFactoryAbi = require("./abi/sbtFactoryAbi.json");
const domainAbi = require("./abi/domainAbi.json");
const sbtDomainAbi = require("./abi/sbtDomainAbi.json");

const main = async () => {
  const hubAddress = "0x5d64B9ef639fecBC755C622C094B3A8A8dbF18A2";
  const factoryAddress = "0x5e9b4433F2087cC526205c85a801D675a499AF49";
  const sbtFactoryAddress = "0xeF1d6F4bbBbC67FdbE553309cE6a062A193481Bb";
  const forbiddenTldsAddress = "0x20FC0BCb329E0545c34e9dAfDBD27700EfEc81eB";
  const metaDataAddress = "0xea828d703DE8e98109FE2d1358Ab92b1E55bDCb4";
  let weedAddress;
  let gardenAddress;
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

  const domainFactory = new ethers.Contract(
    factoryAddress,
    factoryAbi,
    account
  );

  const sbtDomainFactory = new ethers.Contract(
    sbtFactoryAddress,
    sbtFactoryAbi,
    account
  );

  const weed = await domainFactory.tldNamesAddresses(".weed");
  const garden = await sbtDomainFactory.tldNamesAddresses(".garden");
  weedAddress = weed;
  gardenAddress = garden;

  console.log("weedAddress:", weed);
  console.log("gardenAddress:", garden);

  const weedDomain = new ethers.Contract(weedAddress, domainAbi, account);
  const gardenContract = new ethers.Contract(
    gardenAddress,
    sbtDomainAbi,
    account
  );

  const mintTransferable = await weedDomain.mint("bloc", account.address);
  await mintTransferable.wait();
  console.log(
    "minted transferable domain:",
    `https://mumbai.polygonscan.com/tx/${mintTransferable.hash}`
  );
  const mintNonTransferable = await gardenContract.mint(
    "bloc",
    account.address
  );
  await mintNonTransferable.wait();
  console.log(
    "minted non-transferable domain:",
    `https://mumbai.polygonscan.com/tx/${mintNonTransferable.hash}`
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
