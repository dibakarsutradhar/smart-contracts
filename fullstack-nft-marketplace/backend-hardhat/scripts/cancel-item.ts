import { ContractTransaction } from 'ethers';
import { ethers, network } from 'hardhat';
import { BLOCKS, SLEEP_AMOUNT } from '../helper-hardhat-config';
import { BasicNFT, NftMarketplace } from '../typechain-types/';
import moveBlocks from '../utils/move-blocks';

const TOKEN_ID: number = 2;

const cancel = async () => {
  const nftMarketplace: NftMarketplace = await ethers.getContract(
    'NftMarketplace'
  );
  const basicNft: BasicNFT = await ethers.getContract('BasicNFT');
  const tx: ContractTransaction = await nftMarketplace.cancelListing(
    basicNft.address,
    TOKEN_ID
  );
  await tx.wait(1);
  console.log('NFT Canceled');

  if (network.config.chainId == 31337 || '31337') {
    await moveBlocks(BLOCKS, SLEEP_AMOUNT);
  }
};

cancel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
