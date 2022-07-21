import { ContractTransaction } from 'ethers';
// @ts-ignore
import { ethers } from 'hardhat';
import { GovernanceToken } from '../typechain-types/';

const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string
) => {
  const governanceToken: GovernanceToken = await ethers.getContractAt(
    'GovernanceToken',
    governanceTokenAddress
  );
  const tx: ContractTransaction = await governanceToken.delegate(
    delegatedAccount
  );
  await tx.wait(1);
  console.log(
    `Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
};

export default delegate;
