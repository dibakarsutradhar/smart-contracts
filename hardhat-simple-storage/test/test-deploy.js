const { ethers } = require('hardhat');
const { assert } = require('chai');

describe('SimpleStorage', () => {
  let simpleStorageFactory, simpleStorage;

  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory('SimpleStorage');
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it('Should start with a favorite number of 0', async () => {
    const currValue = await simpleStorage.retrieve();
    const expectedValue = '0';

    assert.equal(currValue.toString(), expectedValue);
  });

  it('Should update when we call store', async () => {
    const expectedValue = '7';
    const transactionResponse = await simpleStorage.store(expectedValue);
    await transactionResponse.wait(1);

    const currValue = await simpleStorage.retrieve();
    assert.equal(currValue.toString(), expectedValue);
  });
});
