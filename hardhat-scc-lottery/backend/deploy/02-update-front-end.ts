import * as fs from 'fs';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { stringify } from 'querystring';
import {
  FRONT_END_ABI_FILE,
  FRONT_END_ADDRESSES_FILE,
} from '../helper-hardhat-config';

const updateUI: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { ethers } = hre;
  const chainId: string = '31337';

  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating Front End...');
    const raffle = await ethers.getContract('Raffle');
    const contractAddresses = JSON.parse(
      fs.readFileSync(FRONT_END_ADDRESSES_FILE, 'utf8')
    );
    if (chainId in contractAddresses) {
      if (!contractAddresses[chainId].includes(raffle.address)) {
        contractAddresses[chainId].push(raffle.address);
      }
    } else {
      contractAddresses[chainId] = [raffle.address];
    }

    fs.writeFileSync(
      FRONT_END_ABI_FILE,
      JSON.stringify(raffle.interface)
      // raffle.interface.format(ethers.utils.FormatTypes.json)
    );

    fs.writeFileSync(
      FRONT_END_ADDRESSES_FILE,
      JSON.stringify(contractAddresses)
    );
  }
};

export default updateUI;
updateUI.tags = ['all', 'frontend'];
