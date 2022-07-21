import { DeployFunction, DeployResult } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { MIN_DELAY } from '../helper-hardhat-config';

const deployTimeLock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  // @ts-ignore
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log('Deploying Timelock...!');
  const timeLock: DeployResult = await deploy('TimeLock', {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
    // waitConfirmation:
  });
  log(`Deployed TimeLock token to address ${timeLock.address}`);
};

export default deployTimeLock;
