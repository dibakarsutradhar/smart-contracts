import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const BASE_FEE = '250000000000000000'; // 0.25 is the premium. It costs 0.25 LINK
const GAS_PRICE_LINK = 1e9; // 1000000000

const deployMocks: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // if (developmentChains.includes(network.name)) {
  if (chainId == 31337) {
    log('Local network detected!');
    log('Deploying Mocks...');

    await deploy('VRFCoordinatorV2Mock', {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    });
    log('Mocks Deployed..!');
    log('-----------------------------------------');
  }
};

export default deployMocks;
deployMocks.tags = ['all', 'mocks'];
