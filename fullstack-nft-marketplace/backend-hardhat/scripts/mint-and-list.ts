import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers, network } from 'hardhat';
import { BLOCKS, SLEEP_AMOUNT } from '../helper-hardhat-config';
import { BasicNFT, NftMarketplace } from '../typechain-types/';
import moveBlocks from '../utils/move-blocks';

const PRICE: BigNumber = ethers.utils.parseEther('0.1');

const mintAndList = async () => {
  const nftMarketplace: NftMarketplace = await ethers.getContract(
    'NftMarketplace'
  );
  const basicNft: BasicNFT = await ethers.getContract('BasicNFT');
  console.log('Minting....!');

  const mintTx: ContractTransaction = await basicNft.mintNft();
  const mintTxReceipt: ContractReceipt = await mintTx.wait(1);
  const tokenId: number = mintTxReceipt.events[0].args.tokenId;
  console.log('Approving NFT...');

  const approvalTx: ContractTransaction = await basicNft.approve(
    nftMarketplace.address,
    tokenId
  );
  await approvalTx.wait(1);
  console.log('Listing NFT....');
  const tx: ContractTransaction = await nftMarketplace.listItem(
    basicNft.address,
    tokenId,
    PRICE
  );
  await tx.wait(1);
  console.log('Listed!');

  if (network.config.chainId == 31337 || '31337') {
    await moveBlocks(BLOCKS, SLEEP_AMOUNT);
  }
};

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
