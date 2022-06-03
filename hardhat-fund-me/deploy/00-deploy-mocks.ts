import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DECIMALS, INITIAL_ANSWER } from '../helper-hardhat-config';

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log('local network detected! Deploying Mocks...');
    await deploy('MockV3Aggregator', {
      contract: 'MockV3Aggregator',
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log('mocks deployed!');
    log('----------------------------------------------------');
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    );
    log(
      'Please run `yarn hardhat console` to interact with the deployed smart contracts!'
    );
    log('----------------------------------');
  }
};

export default deployMocks;
deployMocks.tags = ['all', 'mocks '];
