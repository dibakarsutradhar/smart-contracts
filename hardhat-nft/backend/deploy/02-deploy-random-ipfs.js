const { network, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
  tokenUris,
} = require('../helper-hardhat-config');
const { handleTokenUris } = require('../utils/handleTokenUris');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // get the IPFS hashes of the images
  if ((process.env.UPLOAD_TO_PINATA = 'true')) {
    tokenUris = await handleTokenUris();
  }

  // 1. With our own IPFS node
  // 2. Pinata
  // 3. NFT Storage (FileCoin)

  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  log('-----------------------------------------');
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ];

  const randomIpfsNft = await deploy('RandomIPFSNft', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
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

module.exports.tags = ['all', 'randomipfs', 'main'];
