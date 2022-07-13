let chainId = process.env.chainId || 31337;
let moralisChainId = chainId == '31337' ? '1337' : chainId;
const contractAddresses = require('../../constants/networkMapping.json');
const contractAddress = contractAddresses[chainId]['NftMarketplace'][0];

let itemListedOptions = {
  chainId: moralisChainId,
  sync_historical: true,
  topic: 'ItemListed(address,address,uint256,uint256)',
  address: contractAddress,
  abi: {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nftAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
    ],
    name: 'ItemListed',
    type: 'event',
  },
  tableName: 'ItemListed',
};

module.exports = { itemListedOptions };
