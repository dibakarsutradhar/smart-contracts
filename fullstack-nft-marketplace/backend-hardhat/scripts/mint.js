const { ethers, network } = require('hardhat');
const { BLOCKS, SLEEP_AMOUNT } = require('../helper-hardhat-config');
const { moveBlocks } = require('../utils/move-blocks');

const mint = async () => {
  const basicNft = await ethers.getContract('BasicNFT');
  console.log('Minting....!');

  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = mintTxReceipt.events[0].args.tokenId;
  console.log(`Got Token ID ${tokenId}`);
  console.log(`NFT Address: ${basicNft.address}`);

  if (network.config.chainId == '31337') {
    await moveBlocks(BLOCKS, (sleepAmount = SLEEP_AMOUNT));
  }
};

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
