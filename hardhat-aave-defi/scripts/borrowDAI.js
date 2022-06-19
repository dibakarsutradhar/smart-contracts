const borrowDAI = async (
  daiAddress,
  lendingPool,
  amountDAItoBorrowWei,
  account
) => {
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountDAItoBorrowWei,
    1,
    0,
    account
  );

  await borrowTx.wait(1);
  console.log(`You have borrowed ${amountDAItoBorrowWei} DAI`);
};

module.exports = { borrowDAI };
