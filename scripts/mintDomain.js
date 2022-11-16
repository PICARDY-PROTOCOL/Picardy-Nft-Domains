const ethers = require("ethers");
const dotenv = require("dotenv").config();
const hubAbi = require("./abi/hubAbi.json");
const factoryAbi = require("./abi/factoryAbi.json");
const forbiddenAbi = require("./abi/forbiddenAbi.json");
const sbtFactoryAbi = require("./abi/sbtFactoryAbi.json");
const domainAbi = require("./abi/domainAbi.json");
const sbtDomainAbi = require("./abi/sbtDomainAbi.json");

const main = async () => {
  const hubAddress = "0x718cFF78Fa43615cDF1c43415b9C7A63c8cA9814";
  const factoryAddress = "0x311F7f66f35BA7242F1FE5ae0d45eD51145Fa688";
  const sbtFactoryAddress = "0x71D60c6E3723a4a9Cc351cC28Cd2C818Bf19e2D2";
  const forbiddenTldsAddress = "0x37DbCC4f8D5672Ae624d1c92d53a700790009a5E";
  const metaDataAddress = "0x5E8Ef50EAF2237E037217298341458C66cC4836F";
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTP_ENDPOINT
  );
  //const wallet = new ethers.Wallet.fromMnemonic(process.env.PHARSE);

  // const hubAddress = "0x718cFF78Fa43615cDF1c43415b9C7A63c8cA9814";
  // const factoryAddress = "0x311F7f66f35BA7242F1FE5ae0d45eD51145Fa688";
  // const sbtFactoryAddress = "0x71D60c6E3723a4a9Cc351cC28Cd2C818Bf19e2D2";
  // const forbiddenTldsAddress = "0x37DbCC4f8D5672Ae624d1c92d53a700790009a5E";
  // const metaDataAddress = "0x5E8Ef50EAF2237E037217298341458C66cC4836F";

  const privateKey = process.env.PRIVATE_KEY;

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://127.0.0.1:8545"
  // );
  // //wallet from private key
  const wallet = new ethers.Wallet(privateKey, provider);

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

  const bloknessAddress = await domainFactory.tldNamesAddresses(".blokness");
  const picardyAddress = await sbtDomainFactory.tldNamesAddresses(".picardy");

  console.log("blokness:", bloknessAddress);
  console.log("picardy:", picardyAddress);

  const bloknessDomain = new ethers.Contract(
    bloknessAddress,
    domainAbi,
    account
  );
  const picardyDomain = new ethers.Contract(
    picardyAddress,
    sbtDomainAbi,
    account
  );

  const mintTransferable = await bloknessDomain.mint(
    "ghost",
    "0x60b43d4Ef85804223a92774Ee9dAE1362Ab0c288"
  );
  await mintTransferable.wait();
  console.log(
    "minted transferable domain:",
    `https://mumbai.polygonscan.com/tx/${mintTransferable.hash}`
  );
  // const mintNonTransferable = await picardyDomain.mint("arch", account.address);
  // await mintNonTransferable.wait();
  // console.log(
  //   "minted non-transferable domain:",
  //   `https://mumbai.polygonscan.com/tx/${mintNonTransferable.hash}`
  // );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
