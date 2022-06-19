import { BigNumber } from 'ethers';
import { Address } from 'hardhat-deploy/dist/types';
import { ILendingPool } from '../typechain-types/contracts/interfaces/ILendingPool';

const borrowDAI = async (
  daiAddress: string,
  lendingPool: ILendingPool,
  amountDAItoBorrowWei: BigNumber,
  account: Address
) => {
  console.log('------------------------------------------------');
  console.log('YOU ARE NOW BORROWING FROM AAVE');
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountDAItoBorrowWei,
    1,
    0,
    account
  );

  await borrowTx.wait(1);
  console.log(`You have borrowed ${amountDAItoBorrowWei} DAI`);
  console.log('------------------------------------------------');
};

export default borrowDAI;
