import { ContractTransaction } from 'ethers';
import { ethers, network } from 'hardhat';
import { BLOCKS, SLEEP_AMOUNT } from '../helper-hardhat-config';
import { BasicNFT, NftMarketplace } from '../typechain-types';
import moveBlocks from '../utils/move-blocks';

const TOKEN_ID: number = 4;

const buyItem = async () => {
  const nftMarketplace: NftMarketplace = await ethers.getContract(
    'NftMarketplace'
  );
  const basicNft: BasicNFT = await ethers.getContract('BasicNFT');
  const listing: NftMarketplace.ListingStructOutput =
    await nftMarketplace.getListing(basicNft.address, TOKEN_ID);
  const price = listing.price.toString();
  const tx: ContractTransaction = await nftMarketplace.buyItem(
    basicNft.address,
    TOKEN_ID,
    {
      value: price,
    }
  );
  await tx.wait(1);
  console.log('NFT Bought');

  if (network.config.chainId == 31337 || '31337') {
    await moveBlocks(BLOCKS, SLEEP_AMOUNT);
  }
};

buyItem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
