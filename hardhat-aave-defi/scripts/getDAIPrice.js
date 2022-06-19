const { ethers, network } = require('hardhat');
const { networkConfig } = require('../helper-hardhat-config');

const getDAIPrice = async () => {
  const daiEthPriceFeed = await ethers.getContractAt(
    'AggregatorV3Interface',
    networkConfig[network.config.chainId].daiEthPriceFeed
  );

  const price = (await daiEthPriceFeed.latestRoundData())[1];
  console.log(`The DAI/ETH price is ${price.toString()}`);

  return price;
};

module.exports = { getDAIPrice };
