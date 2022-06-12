import { ethers } from 'hardhat';

const enterRaffle = async () => {
  const raffle = await ethers.getContract('Raffle');
  const entranceFee = await raffle.getEntranceFee();
  await raffle.enterRaffle({ value: entranceFee + 1 });
  console.log('Entered Raffle!');
};

enterRaffle()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
