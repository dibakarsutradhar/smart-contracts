const { ethers } = require('hardhat');

const getLendingPool = async (account) => {
  // Lending Pool Address Provider: 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
  const lendingPoolAddressProvider = await ethers.getContractAt(
    'ILendingPoolAddressesProvider',
    '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    account
  );

  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    'ILendingPool',
    lendingPoolAddress,
    account
  );

  return lendingPool;
};

module.exports = { getLendingPool };
