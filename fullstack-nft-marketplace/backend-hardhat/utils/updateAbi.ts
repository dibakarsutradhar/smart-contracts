import * as fs from 'fs';
import { ethers } from 'hardhat';
import {
  frontEndAbiLocationGraph,
  frontEndAbiLocationMoralis,
  frontEndContractsFileGraph,
  frontEndContractsFileMoralis,
} from '../helper-hardhat-config';

const updateAbi = async () => {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  fs.writeFileSync(
    `${frontEndContractsFileMoralis}NftMarketplace.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
  );

  fs.writeFileSync(
    `${frontEndContractsFileGraph}NftMarketplace.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json).toString()
  );

  const basicNft = await ethers.getContract('BasicNFT');
  fs.writeFileSync(
    `${frontEndAbiLocationMoralis}BasicNft.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
  );
  fs.writeFileSync(
    `${frontEndAbiLocationGraph}BasicNft.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json).toString()
  );
};

export default updateAbi;
