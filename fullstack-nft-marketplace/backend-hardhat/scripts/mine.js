const { moveBlocks } = require('../utils/move-blocks');
const { BLOCKS, SLEEP_AMOUNT } = require('../helper-hardhat-config');

const mine = async () => {
  await moveBlocks(BLOCKS, (sleepAmount = SLEEP_AMOUNT));
};

mine()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
