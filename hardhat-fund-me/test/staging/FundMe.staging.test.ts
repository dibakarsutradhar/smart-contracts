import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert, expect } from 'chai';
import { BigNumber } from 'ethers';
import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { developmentChains } from '../../helper-hardhat-config';
import { FundMe, MockV3Aggregator } from '../../typechain-types';

describe('FundMe', async () => {
  let fundMe: FundMe;
  let deployer: SignerWithAddress;
  let mockV3Aggregator: MockV3Aggregator;
  const sendValue: BigNumber = ethers.utils.parseEther('1');

  beforeEach(async () => {
    // if (!developmentChains.includes(network.name)) {
    //   throw 'You need to be on a testnet to run this tests';
    // }

    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    fundMe = await ethers.getContract('FundMe');
    mockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer);
  });

  it('allows people to fund and withdraw', async () => {
    await fundMe.fund({ value: sendValue });
    await fundMe.withdraw();
    const endingBalance = await fundMe.provider.getBalance(fundMe.address);

    assert.equal(endingBalance.toString(), '0');
  });
});
