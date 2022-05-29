import { ethers } from 'hardhat';
import { assert } from 'chai';
import { SimpleStorage, SimpleStorage__factory } from '../typechain-types';

describe('SimpleStorage', () => {
  let simpleStorageFactory: SimpleStorage__factory,
    simpleStorage: SimpleStorage;

  beforeEach(async () => {
    simpleStorageFactory = (await ethers.getContractFactory(
      'SimpleStorage'
    )) as SimpleStorage__factory;
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
