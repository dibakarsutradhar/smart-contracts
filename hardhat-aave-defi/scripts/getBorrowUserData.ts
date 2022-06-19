import { ILendingPool } from '../typechain-types/contracts/interfaces/ILendingPool';
import { Address } from 'hardhat-deploy/dist/types';
import { BigNumber } from 'ethers';

const getBorrowUserData = async (
  lendingPool: ILendingPool,
  account: Address
): Promise<[BigNumber, BigNumber]> => {
  console.log('------------------------------------------------');
  console.log('GETTING UPDATED USER DEPOSIT & BORROW STATISTICS');
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);

  console.log('------------------------------------------------');
  console.log(`You have ${totalCollateralETH} worth of ETH deposited`);
  console.log(`You have ${totalDebtETH} worth of ETH borrowed`);
  console.log(`You can borrow ${availableBorrowsETH} worth of ETH`);
  console.log('------------------------------------------------');

  return [availableBorrowsETH, totalDebtETH];
};

export default getBorrowUserData;
