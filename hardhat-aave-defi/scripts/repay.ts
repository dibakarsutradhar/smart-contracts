import { BigNumber } from 'ethers';
import { Address } from 'hardhat-deploy/dist/types';
import { ILendingPool } from '../typechain-types/contracts/interfaces/ILendingPool';
import approveERC20 from './approveERC20';

const repay = async (
  amount: BigNumber,
  daiAddress: string,
  lendingPool: ILendingPool,
  account: Address
) => {
  console.log('------------------------------------------------');
  console.log('YOU ARE NOW REPAYING BACK TO AAVE');

  await approveERC20(daiAddress, lendingPool.address, amount, account);

  const repayTx = await lendingPool.repay(daiAddress, amount, 1, account);
  await repayTx.wait(1);
  console.log(`You have now repayed ${amount} DAI to ${daiAddress} address`);
  console.log('------------------------------------------------');
};

export default repay;
