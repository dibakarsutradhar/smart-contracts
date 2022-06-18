const { getWeth } = require('./getWeth');
const { getNamedAccounts } = require('hardhat');
const { getLendingPool } = require('./getLendingPool');

const main = async () => {
  // the protocol treats everything as an ERC20 token
  const { deployer } = await getNamedAccounts();
  await getWeth(deployer);
  // abi, address
  // Lending Pool
  const lendingPool = await getLendingPool(deployer);
  console.log(`Lending Pool Address: ${lendingPool.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
