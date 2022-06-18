const { getWeth } = require('./getWeth');
const { getNamedAccounts, network } = require('hardhat');
const { getLendingPool } = require('./getLendingPool');
const { approveERC20 } = require('./approveERC20');
const { AMOUNT, networkConfig } = require('../helper-hardhat-config');

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
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
