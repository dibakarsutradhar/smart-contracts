const { ethers, network } = require('hardhat');
const fs = require('fs');
const { frontEndContractsFile } = require('../helper-hardhat-config');

const updateContractAddresses = async () => {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const chainId = network.config.chainId;
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, 'utf-8')
  );

  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]['NftMarketplace'].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]['NftMarketplace'].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] };
  }

  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
};

module.exports = { updateContractAddresses };
