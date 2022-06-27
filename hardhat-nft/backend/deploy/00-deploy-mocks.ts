import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DECIMALS, INITIAL_PRICE } from '../helper-hardhat-config';

const BASE_FEE: string = '250000000000000000'; // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK: number = 1e9; // link per gas, is this the gas lane? // 0.000000001 LINK per gas

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId;
  // If we are on a local development network, we need to deploy mocks!
  if (chainId == 31337) {
    log('-----------------------------------------');
    log('-----------------------------------------');
    log('Local network detected! Deploying mocks...');
    await deploy('VRFCoordinatorV2Mock', {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    });

    await deploy('MockV3Aggregator', {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });

    log('Mocks Deployed!');
    log('-----------------------------------------');
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    );
    log(
      'Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!'
    );
    log('-----------------------------------------');
  }
};

export default deployMocks;
deployMocks.tags = ['all', 'mocks', 'main'];