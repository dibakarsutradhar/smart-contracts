import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';

const approveERC20 = async (
  erc20Address: string,
  spenderAddress: string,
  amountToSpend: BigNumber,
  account: Address
) => {
  console.log('------------------------------------------------');
  console.log(
    `Approving ERC20 Token Address from ${spenderAddress} for ${amountToSpend} worth of ETH`
  );
  const erc20Token = await ethers.getContractAt(
    'IERC20',
    erc20Address,
    account
  );

  const tx = await erc20Token.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
  console.log('Approved!');
  console.log('------------------------------------------------');
};

export default approveERC20;
