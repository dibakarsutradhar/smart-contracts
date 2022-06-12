import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  developmentChains,
  networkConfig,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from '../helper-hardhat-config';
import verify from '../utils/verify';

type chainId = number;

const VRF_SUB_FUND_AMOUNT = '1000000000000000000000';

const deployRaffle: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: chainId = network.config.chainId!;
  // const chainId = 31337;
  let vrfCoordinatorV2Address, subscriptionId;

  // if (developmentChains.includes(network.name)) {
  if (chainId == 31337) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.events[0].args.subId;
    // Fund the subscription \
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address =
      networkConfig[network.config.chainId!]['vrfCoordinatorV2'];
    subscriptionId = networkConfig[network.config.chainId!]['subscriptionId'];
  }

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log('------------------------------------------------');

  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[network.config.chainId!]['gasLane'],
    networkConfig[network.config.chainId!]['keepersUpdateInterval'],
    networkConfig[network.config.chainId!]['raffleEntranceFee'],
    networkConfig[network.config.chainId!]['callbackGasLimit'],
  ];

  const raffle = await deploy('Raffle', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...!');
    await verify(raffle.address, args);
  }

  log('------------------------------------------------');
};

export default deployRaffle;
deployRaffle.tags = ['all', 'raffle'];
