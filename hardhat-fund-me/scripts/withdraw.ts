import { getNamedAccounts, ethers } from 'hardhat';

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract('FundMe', deployer);
  console.log('Funding...');
  const transactionResponse = await fundMe.withdraw();
  await transactionResponse.wait();
  console.log('Got it back');
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
