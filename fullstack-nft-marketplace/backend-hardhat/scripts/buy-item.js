const { ethers, network } = require('hardhat');
const { BLOCKS, SLEEP_AMOUNT } = require('../helper-hardhat-config');
const { moveBlocks } = require('../utils/move-blocks');

const TOKEN_ID = 4;

const buyItem = async () => {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const basicNft = await ethers.getContract('BasicNFT');
  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
  const price = listing.price.toString();
  const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
    value: price,
  });
  await tx.wait(1);
  console.log('NFT Bought');

  if (network.config.chainId == '31337') {
    await moveBlocks(BLOCKS, (sleepAmount = SLEEP_AMOUNT));
  }
};

buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
