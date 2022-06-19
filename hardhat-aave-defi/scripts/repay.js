const { approveERC20 } = require('./approveERC20');

const repay = async (amount, daiAddress, lendingPool, account) => {
  console.log(`Repaying borrowed ${amount} DAI`);

  await approveERC20(daiAddress, lendingPool.address, amount, account);

  const repayTx = await lendingPool.repay(daiAddress, amount, 1, account);
  await repayTx.wait(1);
  console.log(`You have now repayed ${amount} DAI to ${daiAddress} address`);
};

module.exports = { repay };
