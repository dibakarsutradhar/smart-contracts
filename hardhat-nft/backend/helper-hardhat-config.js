const networkConfig = {
  31337: {
    name: 'localhost',
    ethUsdPriceFeed: '0x9326BFA02ADD2366b30bacB125260Af641031331',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    mintFee: '10000000000000000', // 0.01 ETH
    callbackGasLimit: '500000', // 500,000 gas
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  4: {
    name: 'rinkeby',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    callbackGasLimit: '500000', // 500,000 gas
    mintFee: '10000000000000000', // 0.01 ETH
    subscriptionId: '6258', // add your ID here!
  },
};

const DECIMALS = '18';
const INITIAL_PRICE = '200000000000000000000';
const developmentChains = ['hardhat', 'localhost'];
const imagesLocation = './images/randomNft';
const FUND_AMOUNT = '1000000000000000000000';

let tokenUris = [
  'ipfs://QmPsddgwx2s4HE5V9so61eSR3NfGgJMkHgpTRBw1jnmTrH',
  'ipfs://QmYzrvrN5pSqx19qXUCvJm4uau1rcpytPJGzzBkJQDdv82',
  'ipfs://QmPU6NzQQFJKWJ6MukigvnU4D2GWTvcTtSqQu1U735UNqV',
];

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
  imagesLocation,
  FUND_AMOUNT,
  tokenUris,
};
