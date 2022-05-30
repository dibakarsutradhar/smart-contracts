const { network } = require('hardhat');
const { networkConfig, developmentChain } = require('../helper-hardhat-config');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // If chainId is X use address Y
  let ethUsdPriceFeedAddress;

  if (developmentChain.includes(network.name)) {
    const ethUsdAggregator = await deployments.get('MockV3Aggregator');
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeed = networkConfig[chainId]['ethUsdPriceFeed'];
  }

  // If the contract doesn't exist, deploy a minimal version of
  // for the local testing

  const fundMe = await deploy('FundMe', {
    from: deployer,
    args: [ethUsdPriceFeedAddress], // price feed
    log: true,
  });
  log('----------------------------------------');
};

module.exports.tags = ['all', 'fundme '];
