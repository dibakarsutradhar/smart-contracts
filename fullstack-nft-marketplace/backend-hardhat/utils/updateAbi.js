const { ethers, network } = require('hardhat');
const fs = require('fs');
const { frontEndAbiLocation } = require('../helper-hardhat-config');

const updateAbi = async () => {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  fs.writeFileSync(
    `${frontEndAbiLocation}NftMarketplace.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
  );

  const basicNft = await ethers.getContract('BasicNFT');
  fs.writeFileSync(
    `${frontEndAbiLocation}BasicNft.json`,
    basicNft.interface.format(ethers.utils.FormatTypes.json)
  );
};

module.exports = { updateAbi };
