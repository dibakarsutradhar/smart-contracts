import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert, expect } from 'chai';
import { BigNumber } from 'ethers';
import { deployments, ethers, network } from 'hardhat';
import { developmentChains } from '../../helper-hardhat-config';
import { FundMe, MockV3Aggregator } from '../../typechain-types';

describe('FundMe', async () => {
  let fundMe: FundMe;
  let deployer: SignerWithAddress;
  let mockV3Aggregator: MockV3Aggregator;
  const sendValue: BigNumber = ethers.utils.parseEther('1');

  beforeEach(async () => {
    if (!developmentChains.includes(network.name)) {
      throw 'You need to be on a development chain to run tests';
    }

    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    await deployments.fixture(['all']);
    fundMe = await ethers.getContract('FundMe');
    mockV3Aggregator = await ethers.getContract('MockV3Aggregator');
  });

  describe('constructor', () => {
    it('sets the aggregator addresses correctly', async () => {
      const response = await fundMe.getPriceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe('fund', () => {
    it("fails if you don't send enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        'You need to spend more ETH'
      );
    });

    it('update the amount funded data structure', async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.getAddressToAmountFunded(deployer.address);
      assert.equal(response.toString(), sendValue.toString());
    });

    it('adds funder to array of funder', async () => {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.getFunder(0);
      assert.equal(funder, deployer.address);
    });
  });

  describe('withdraw', () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });

    it('withdraw ETH from a single funder', async () => {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer.address
      );

      // Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait();
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(
        deployer.address
      );

      // Assert
      assert.equal(endingFundMeBalance.toString(), '0');
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it('withdraw ETH from a single funder but cheaper', async () => {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer.address
      );

      // Act
      const transactionResponse = await fundMe.cheaperWithdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(
        deployer.address
      );

      // Assert
      assert.equal(endingFundMeBalance.toString(), '0');
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it('allows us to withdraw with multiple funders', async () => {
      // Arrange
      const accounts = await ethers.getSigners();

      await fundMe.connect(accounts[1]).fund({
        value: sendValue,
      });
      await fundMe.connect(accounts[2]).fund({
        value: sendValue,
      });
      await fundMe.connect(accounts[3]).fund({
        value: sendValue,
      });
      await fundMe.connect(accounts[4]).fund({
        value: sendValue,
      });
      await fundMe.connect(accounts[5]).fund({
        value: sendValue,
      });

      // Act
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer.address
      );

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait();
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      console.log(`GasCost: ${gasCost}`);
      console.log(`GasUsed: ${gasUsed}`);
      console.log(`GasPrice: ${effectiveGasPrice}`);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(
        deployer.address
      );

      // Assert
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );

      // Make sure that getFunder are resetted properly
      await expect(fundMe.getFunder(0)).to.be.reverted;

      assert.equal(
        (await fundMe.getAddressToAmountFunded(accounts[1].address)).toString(),
        '0'
      );
      assert.equal(
        (await fundMe.getAddressToAmountFunded(accounts[2].address)).toString(),
        '0'
      );
      assert.equal(
        (await fundMe.getAddressToAmountFunded(accounts[3].address)).toString(),
        '0'
      );
      assert.equal(
        (await fundMe.getAddressToAmountFunded(accounts[4].address)).toString(),
        '0'
      );
      assert.equal(
        (await fundMe.getAddressToAmountFunded(accounts[5].address)).toString(),
        '0'
      );
    });

    it('only allows the owner to withdraw', async () => {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const attackerConnectedContract = await fundMe.connect(attacker);

      await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
        'FundMe__NotOwner'
      );
    });

    it('allows us to withdraw with multiple funders cheaper', async () => {
      // Arrange
      const accounts = await ethers.getSigners();

      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendValue });
      }

      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer.address
      );

      // Act
      const transactionResponse = await fundMe.cheaperWithdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(
        deployer.address
      );

      // Assert
      assert.equal(endingFundMeBalance.toString(), '0');
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );

      // Make sure that funders are resetted properly
      await expect(fundMe.getFunder(0)).to.be.reverted;

      for (let i = 1; i < 6; i++) {
        assert.equal(
          await (
            await fundMe.getAddressToAmountFunded(accounts[i].address)
          ).toString(),
          '0'
        );
      }
    });
  });
});
