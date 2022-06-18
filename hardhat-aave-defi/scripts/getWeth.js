const { ethers } = require('hardhat');

const AMOUNT = ethers.utils.parseEther('0.02');

const getWeth = async (account) => {
  // call the 'deposit' function on the weth contract
  // abi, contract address
  // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  const iWeth = await ethers.getContractAt(
    'IWeth',
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    account
  );

  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(account);
  console.log(`Got ${wethBalance.toString()} WETH`);
};

module.exports = { getWeth, AMOUNT };
