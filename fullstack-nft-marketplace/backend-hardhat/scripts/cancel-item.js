const { ethers, network } = require('hardhat');
const { BLOCKS, SLEEP_AMOUNT } = require('../helper-hardhat-config');
const { moveBlocks } = require('../utils/move-blocks');

const TOKEN_ID = 2;

const cancel = async () => {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNFT');
  const tx = await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID);
  await tx.wait(1);
  console.log('NFT Canceled');

  if (network.config.chainId == '31337') {
    await moveBlocks(BLOCKS, (sleepAmount = SLEEP_AMOUNT));
  }
};

cancel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
