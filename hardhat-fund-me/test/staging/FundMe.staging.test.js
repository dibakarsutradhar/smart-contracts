const { assert } = require('chai');
const { ethers, getNamedAccounts, network } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

describe('FundMe', async () => {
  let fundMe;
  let deployer;
  const sendValue = ethers.utils.parseEther('1');

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    fundMe = await ethers.getContract('FundMe', deployer);
  });

  it('allows people to fund and withdraw', async () => {
    await fundMe.fund({ value: sendValue });
    await fundMe.withdraw();
    const endingBalance = await fundMe.provider.getBalance(fundMe.address);

    assert.equal(endingBalance.toString(), '0');
  });
});
