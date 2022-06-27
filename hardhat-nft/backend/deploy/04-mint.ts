import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { developmentChains } from '../helper-hardhat-config';
import {
  BasicNFT,
  RandomIPFSNft,
  VRFCoordinatorV2Mock,
} from '../typechain-types';
import { DynamicSvgNft } from '../typechain-types/contracts/DynamicSvgNft';

const mint: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, network } = hre;
  const { deployer } = await getNamedAccounts();

  // Basic NFT
  const basicNFT: BasicNFT = await ethers.getContract('BasicNFT', deployer);
  const basicMintTx: ContractTransaction = await basicNFT.mintNft();
  await basicMintTx.wait(1);
  console.log(`Basic NFT index 0 has tokenURI: ${await basicNFT.tokenURI(0)}`);

  // Random IPFS NFT
  const randomIpfsNft: RandomIPFSNft = await ethers.getContract(
    'RandomIPFSNft',
    deployer
  );
  const mintFee: BigNumber = await randomIpfsNft.getMintFee();
  const randomIpfsNftMintTx: ContractTransaction =
    await randomIpfsNft.requestNft({
      value: mintFee.toString(),
    });
  const randomIpfsNftMintTxReceipt: ContractReceipt =
    await randomIpfsNftMintTx.wait(1);

  await new Promise<void>(async (resolve) => {
    setTimeout(resolve, 300000); // 5 mins
    randomIpfsNft.once('NftMinted', async () => {
      resolve();
    });

    if (developmentChains.includes(network.name)) {
      const requestId: string =
        randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
      const vrfCoordinatorV2Mock: VRFCoordinatorV2Mock =
        await ethers.getContract('VRFCoordinatorV2Mock', deployer);

      await vrfCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        randomIpfsNft.address
      );
    }
  });

  console.log(
    `Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`
  );

  // Dynamic SVG NFT
  const highValue: BigNumber = ethers.utils.parseEther('4000');
  const dynamicSvgNft: DynamicSvgNft = await ethers.getContract(
    'DynamicSvgNft',
    deployer
  );
  const dynamicSvgNftMintTx: ContractTransaction = await dynamicSvgNft.mintNft(
    highValue.toString()
  );
  await dynamicSvgNftMintTx.wait(1);
  console.log(
    `Dynamic SVG IPFS NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`
  );
};

export default mint;
mint.tags = ['all', 'mint'];
