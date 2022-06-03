import { getNamedAccounts, ethers } from 'hardhat';

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract('FundMe', deployer);
  console.log('Funding Contract....');
  const transactionResponse = await fundMe.fund({
    value: ethers.utils.parseEther('1'),
  });
  await transactionResponse.wait();
  console.log('Funded');
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
