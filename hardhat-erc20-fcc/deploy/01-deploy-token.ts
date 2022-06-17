import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  INITIAL_SUPPLY,
  networkConfig,
  developmentChains,
} from '../helper-hardhat-config';
import verify from '../utils/verify';

const deployToken: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;

  const ourERCToken = await deploy('OurERC20', {
    from: deployer,
    args: [INITIAL_SUPPLY],
    log: true,
    // We need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`ourERC20 deployer at ${ourERCToken.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(ourERCToken.address, [INITIAL_SUPPLY]);
  }
};

export default deployToken;
deployToken.tags = ['all'];
