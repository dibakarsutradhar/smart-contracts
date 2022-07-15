import { ContractReceipt, ContractTransaction } from 'ethers';
import { ethers, network } from 'hardhat';
import { BLOCKS, SLEEP_AMOUNT } from '../helper-hardhat-config';
import { BasicNFT } from '../typechain-types/';
import moveBlocks from '../utils/move-blocks';

const mint = async () => {
  const basicNft: BasicNFT = await ethers.getContract('BasicNFT');
  console.log('Minting....!');

  const mintTx: ContractTransaction = await basicNft.mintNft();
  const mintTxReceipt: ContractReceipt = await mintTx.wait(1);
  const tokenId: number = mintTxReceipt.events[0].args.tokenId;
  console.log(`Got Token ID ${tokenId}`);
  console.log(`NFT Address: ${basicNft.address}`);

  if (network.config.chainId == 31337 || '31337') {
    await moveBlocks(BLOCKS, SLEEP_AMOUNT);
  }
};

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
