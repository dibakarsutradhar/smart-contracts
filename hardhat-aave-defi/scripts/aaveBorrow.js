const { getWeth } = require('./getWeth');
const { getNamedAccounts, network, ethers } = require('hardhat');
const { getLendingPool } = require('./getLendingPool');
const { approveERC20 } = require('./approveERC20');
const { AMOUNT, networkConfig } = require('../helper-hardhat-config');
const { getBorrowUserData } = require('./getBorrowUserData');
const { getDAIPrice } = require('./getDAIPrice');
const { borrowDAI } = require('./borrowDAI');

const main = async () => {
  // the protocol treats everything as an ERC20 token
  const { deployer } = await getNamedAccounts();

  // Conversation to WETH
  await getWeth(deployer);

  // Lending Pool
  const lendingPool = await getLendingPool(deployer);
  console.log(`Lending Pool Address: ${lendingPool.address}`);

  // Deposit
  const wethTokenAddress = networkConfig[network.config.chainId].wethToken;

  // Approve
  await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
  console.log('Depositing...!');
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log('Deposited...!');

  // User data
  let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
    lendingPool,
    deployer
  );

  const daiPrice = await getDAIPrice();
  const amountDAItoBorrow =
    availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());
  console.log(`You can borrow total ${amountDAItoBorrow} DAI`);

  const amountDAItoBorrowWei = ethers.utils.parseEther(
    amountDAItoBorrow.toString()
  );
  console.log(`You can borrow total ${amountDAItoBorrowWei} WEI`);

  // Borrow Time!
  const daiTokenAddress = networkConfig[network.config.chainId].daiToken;
  await borrowDAI(daiTokenAddress, lendingPool, amountDAItoBorrowWei, deployer);
  await getBorrowUserData(lendingPool, deployer);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
