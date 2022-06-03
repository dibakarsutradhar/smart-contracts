import { DeployFunction } from 'hardhat-deploy/types';
import { networkConfig, developmentChains } from '../helper-hardhat-config';
import verify from '../utils/verify';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

type chainId = number;
type ethUsdPriceFeedAddress = string;

const deployFundMe: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: chainId = network.config.chainId!;

  // If chainId is X use address Y
  let ethUsdPriceFeedAddress: ethUsdPriceFeedAddress;

  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get('MockV3Aggregator');
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[network.name].ethUsdPriceFeed!;
  }

  // If the contract doesn't exist, deploy a minimal version of
  // for the local testing

  log('----------------------------------------------------');
  log('Deploying FundMe and waiting for confirmations...');

  const fundMe = await deploy('FundMe', {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  });

  log(`FundMe deployed at ${fundMe.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // verify
    await verify(fundMe.address, [ethUsdPriceFeedAddress]);
  }

  log('----------------------------------------');
};

export default deployFundMe;
deployFundMe.tags = ['all', 'fundme '];
