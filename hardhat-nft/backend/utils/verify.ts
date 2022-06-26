import { run } from 'hardhat';

type contractAddress = string;
type args = any[];

const verify = async (contractAddress: contractAddress, args: args) => {
  console.log('Verifying Contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Contract Already Verified!');
    } else {
      console.log(e);
    }
  }
};

export default verify;
