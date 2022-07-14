import { ethers, network } from 'hardhat';
import * as fs from 'fs';
import {
  frontEndContractsFileMoralis,
  frontEndContractsFileGraph,
} from '../helper-hardhat-config';

const updateContractAddresses = async () => {
  const nftMarketplace = await ethers.getContract('NftMarketplace');
  const chainId: string = network.config.chainId!.toString();
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFileMoralis, 'utf-8')
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

  fs.writeFileSync(
    frontEndContractsFileMoralis,
    JSON.stringify(contractAddresses)
  );
  fs.writeFileSync(
    frontEndContractsFileGraph,
    JSON.stringify(contractAddresses)
  );
};

export default updateContractAddresses;
