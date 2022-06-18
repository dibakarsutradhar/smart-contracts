const { getWeth, AMOUNT } = require('./getWeth');
const { getNamedAccounts } = require('hardhat');
const { getLendingPool } = require('./getLendingPool');
const { approveERC20 } = require('./approveERC20');

const main = async () => {
  // the protocol treats everything as an ERC20 token
  const { deployer } = await getNamedAccounts();

  // Conversation to WETH
  await getWeth(deployer);

  // Lending Pool
  const lendingPool = await getLendingPool(deployer);
  console.log(`Lending Pool Address: ${lendingPool.address}`);

  // Deposit
  const wethTokenAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

  // Approve
  await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
  console.log('Depositing...!');
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log('Deposited...!');
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
