const { ethers } = require('hardhat');

const approveERC20 = async (
  erc20Address,
  spenderAddress,
  amountToSpend,
  account
) => {
  const erc20Token = await ethers.getContractAt(
    'IERC20',
    erc20Address,
    account
  );

  const tx = await erc20Token.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
  console.log('Approved!');
};

module.exports = { approveERC20 };
