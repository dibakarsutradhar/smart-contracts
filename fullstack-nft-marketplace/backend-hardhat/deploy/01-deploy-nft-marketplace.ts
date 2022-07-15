import { DeployFunction, DeployResult } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from '../helper-hardhat-config';
import verify from '../utils/verify';

const deployNftMarketplace: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const waitBlockConfirmations: number = developmentChains.includes(
    network.name
  )
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log('-----------------------------------------');

  let args: any[] = [];

  const nftMarketPlace: DeployResult = await deploy('NftMarketplace', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('-----------------------------------------');
    log('Verifying....!');
    await verify(nftMarketPlace.address, args);
  }

  log('-----------------------------------------');
};

export default deployNftMarketplace;
deployNftMarketplace.tags = ['all', 'nftmarketplace'];
