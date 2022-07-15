import { BLOCKS, SLEEP_AMOUNT } from '../helper-hardhat-config';
import moveBlocks from '../utils/move-blocks';

const mine = async () => {
  await moveBlocks(BLOCKS, SLEEP_AMOUNT);
};

mine()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
