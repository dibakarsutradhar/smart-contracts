import * as fs from 'fs-extra';
import { PathLike } from 'fs-extra';
import { ethers } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';
import { DeployFunction, DeployResult } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment, TaskArguments } from 'hardhat/types';
import {
  developmentChains,
  networkConfig,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from '../helper-hardhat-config';
import { MockV3Aggregator } from '../typechain-types/';
import verify from '../utils/verify';

const deployDynamicNft: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let ethUsdPriceFeedAddress: Address;

  log('-----------------------------------------');
  if (developmentChains.includes(network.name)) {
    const EthUsdAggregator: MockV3Aggregator = await ethers.getContract(
      'MockV3Aggregator'
    );
    ethUsdPriceFeedAddress = EthUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId!].ethUsdPriceFeed;
  }

  const lowSVG: PathLike = await fs.readFileSync(
    './images/dynamicNft/frown.svg',
    {
      encoding: 'utf-8',
    }
  );

  const highSVG: PathLike = await fs.readFileSync(
    './images/dynamicNft/happy.svg',
    {
      encoding: 'utf-8',
    }
  );

  const waitBlockConfirmations: number = developmentChains.includes(
    network.name
  )
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  const args: TaskArguments = [ethUsdPriceFeedAddress, lowSVG, highSVG];

  log('DEPLOYING CONTRACT.....!');
  log('PLEASE WAIT.....!');

  const dynamicSvgNft: DeployResult = await deploy('DynamicSvgNft', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations || 1,
  });

  log('-----------------------------------------');

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('VERIFYING CONTRACT ON ETHERSCAN...!');
    log('This might take a while, please wait....!');
    await verify(dynamicSvgNft.address, args);
  }
};

export default deployDynamicNft;
deployDynamicNft.tags = ['all', 'dynamicnft', 'main'];
