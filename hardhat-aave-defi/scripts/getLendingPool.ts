import { ethers, network } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';
import { networkConfig } from '../helper-hardhat-config';
import { ILendingPoolAddressesProvider } from '../typechain-types/@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider';
import { ILendingPool } from '../typechain-types/contracts/interfaces/ILendingPool';

const getLendingPool = async (account: Address): Promise<ILendingPool> => {
  console.log('------------------------------------------------');
  console.log('Getting Lending Pool Address...!');
  const lendingPoolAddressProvider: ILendingPoolAddressesProvider =
    await ethers.getContractAt(
      'ILendingPoolAddressesProvider',
      networkConfig[network.config!.chainId!].lendingPoolAddressesProvider!,
      account
    );

  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
  const lendingPool: ILendingPool = await ethers.getContractAt(
    'ILendingPool',
    lendingPoolAddress,
    account
  );

  console.log(`Lending Pool Address: ${lendingPool.address}`);
  console.log('------------------------------------------------');

  return lendingPool;
};

export default getLendingPool;
