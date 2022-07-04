const Moralis = require('moralis/node');
require('dotenv').config();
const contractAddresses = require('./constants/networkMapping.json');
const {
  itemListedOptions,
  itemBoughtOptions,
  itemCanceledOptions,
} = require('./utils/event-options');

let chainId = process.env.chainId || 31337;
const contractAddress = contractAddresses[chainId]['NftMarketplace'][0];

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.moralisMasterKey;

const main = async () => {
  console.log('Starting Moralis Server...!');
  await Moralis.start({ serverUrl, appId, masterKey });
  console.log(`Working with contract address: ${contractAddress}`);

  const listedResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemListedOptions,
    { useMasterKey: true }
  );

  const boughtResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemBoughtOptions,
    { useMasterKey: true }
  );

  const canceledResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemCanceledOptions,
    { useMasterKey: true }
  );

  if (
    listedResponse.success &&
    canceledResponse.success &&
    boughtResponse.success
  ) {
    console.log('Success! Database updated with watching events');
  } else {
    console.log('Something went wrong');
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
