import { DeployFunction, DeployResult } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import delegate from '../utils/delegate';

const deployGovernanceToken: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  // @ts-ignore
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log('Deploying Governance Token...!');
  const governanceToken: DeployResult = await deploy('GovernanceToken', {
    from: deployer,
    args: [],
    log: true,
    // waitConfirmation:
  });
  log(`Deployed governance token to address ${governanceToken.address}`);

  await delegate(governanceToken.address, deployer);
};

export default deployGovernanceToken;
