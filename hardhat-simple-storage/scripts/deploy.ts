import { ethers, network, run } from 'hardhat';

type contractAddress = string;
type args = any[];
type err = any;

const main = async () => {
  const SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
  console.log('Deploying Contract....');
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed Contract to: ${simpleStorage.address}`);
  // console.log(network.config);

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    console.log('Waiting for Contract Verification');
    console.log('Current waiting time is 6 block');
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currentValue}`);

  // Update the current value
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value: ${updatedValue}`);
};

const verify = async (contractAddress: contractAddress, args: args) => {
  console.log('Verifying Contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: err) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Contract Already Verified!');
    } else {
      console.log(e);
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
