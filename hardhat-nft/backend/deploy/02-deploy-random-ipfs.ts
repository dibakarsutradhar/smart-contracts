import { ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';
import { DeployFunction, DeployResult } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment, TaskArguments } from 'hardhat/types';
import { VRFCoordinatorV2Mock } from '../../../hardhat-scc-lottery/backend/typechain-types/@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock';
import {
  developmentChains,
  FUND_AMOUNT,
  networkConfig,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from '../helper-hardhat-config';
import { handleTokenUris } from '../utils/handleTokenUris';
import verify from '../utils/verify';

let tokenUris: string[] = [
  'ipfs://QmPsddgwx2s4HE5V9so61eSR3NfGgJMkHgpTRBw1jnmTrH',
  'ipfs://QmYzrvrN5pSqx19qXUCvJm4uau1rcpytPJGzzBkJQDdv82',
  'ipfs://QmPU6NzQQFJKWJ6MukigvnU4D2GWTvcTtSqQu1U735UNqV',
];

// let tokenUris: string[];

const deployRandomNft: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId;
  let vrfCoordinatorV2Address: Address, subscriptionId: string;

  // get the IPFS hashes of the images
  if ((process.env.UPLOAD_TO_PINATA = 'true')) {
    tokenUris = await handleTokenUris();
  }

  // 1. With our own IPFS node
  // 2. Pinata
  // 3. NFT Storage (FileCoin)

  if (chainId == 31337) {
    // Create VRF Subscription
    const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx: ContractTransaction =
      await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt: ContractReceipt = await tx.wait();
    subscriptionId = txReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId!].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId!].subscriptionId;
  }

  const waitBlockConfirmations: number = developmentChains.includes(
    network.name
  )
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  log('-----------------------------------------');
  const args: TaskArguments = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId!]['gasLane'],
    networkConfig[chainId!]['mintFee'],
    networkConfig[chainId!]['callbackGasLimit'],
    tokenUris,
  ];

  const randomIpfsNft: DeployResult = await deploy('RandomIPFSNft', {
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
    await verify(randomIpfsNft.address, args);
  }
};

export default deployRandomNft;
deployRandomNft.tags = ['all', 'randomipfs', 'main'];
