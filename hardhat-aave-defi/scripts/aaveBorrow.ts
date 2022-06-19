import { ethers, getNamedAccounts, network } from 'hardhat';
import { AMOUNT, networkConfig } from '../helper-hardhat-config';
import { ILendingPool } from '../typechain-types/contracts/interfaces/ILendingPool';
import approveERC20 from './approveERC20';
import borrowDAI from './borrowDAI';
import getBorrowUserData from './getBorrowUserData';
import getDAIPrice from './getDAIPrice';
import getLendingPool from './getLendingPool';
import getWeth from './getWeth';
import repay from './repay';

const main = async () => {
  // the protocol treats everything as an ERC20 token
  const { deployer } = await getNamedAccounts();

  // Conversation to WETH
  await getWeth(deployer);

  // Lending Pool
  const lendingPool: ILendingPool = await getLendingPool(deployer);
  // console.log(`Lending Pool Address: ${lendingPool.address}`);

  // Deposit
  const wethTokenAddress = networkConfig[network.config!.chainId!].wethToken!;

  // Approve
  await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
  console.log('------------------------------------------------');
  console.log('Depositing...!');
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log('Deposited...!');
  console.log('------------------------------------------------');

  // User data
  let borrowReturnData = await getBorrowUserData(lendingPool, deployer);
  let availableBorrowsETH = borrowReturnData[0];

  const daiPrice = await getDAIPrice();
  const amountDAItoBorrow = availableBorrowsETH.div(daiPrice);
  console.log('------------------------------------------------');
  console.log(`You can borrow total ${amountDAItoBorrow} DAI`);

  const amountDAItoBorrowWei = ethers.utils.parseEther(
    amountDAItoBorrow.toString()
  );
  console.log(`You can borrow total ${amountDAItoBorrowWei} WEI`);
  console.log('------------------------------------------------');

  // Borrow Time!
  const daiTokenAddress = networkConfig[network.config!.chainId!].daiToken!;
  await borrowDAI(daiTokenAddress, lendingPool, amountDAItoBorrowWei, deployer);
  await getBorrowUserData(lendingPool, deployer);

  // Repay
  await repay(amountDAItoBorrowWei, daiTokenAddress, lendingPool, deployer);
  await getBorrowUserData(lendingPool, deployer);

  // Repay Interest
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
