import { AMOUNT, networkConfig } from '../helper-hardhat-config';
import { ethers, network } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';

export const getWeth = async (account: Address) => {
  console.log('------------------------------------------------');
  console.log('Getting WETH');
  const iWeth = await ethers.getContractAt(
    'IWeth',
    networkConfig[network.config!.chainId!].wethToken!,
    account
  );

  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(account);
  console.log(`Got ${wethBalance.toString()} WETH`);
  console.log('------------------------------------------------');
};

export default getWeth;
