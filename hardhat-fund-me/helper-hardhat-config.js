const networkConfig = {
  4: {
    name: 'rinkeby',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
  },
  31337: {
    name: 'localhost',
  },
};

const developmentChain = ['hardhat', 'localhost'];
const DECIMALS = '8';
const INITIAL_ANSWER = '20000000000';

module.exports = { networkConfig, developmentChain, DECIMALS, INITIAL_ANSWER };
