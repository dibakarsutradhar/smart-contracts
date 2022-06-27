import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert } from 'chai';
import { BigNumber, ContractTransaction } from 'ethers';
import { deployments, ethers, network } from 'hardhat';
import { developmentChains } from '../../helper-hardhat-config';
import { BasicNFT } from '../../typechain-types/contracts/BasicNFT';

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Basic NFT Unit Tests', () => {
      let basicNft: BasicNFT, deployer: SignerWithAddress;

      beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(['mocks', 'basicnft']);
        basicNft = await ethers.getContract('BasicNFT');
      });

      it('Allows users to mint an NFT, and updates appropriately', async () => {
        const txResponse: ContractTransaction = await basicNft.mintNft();
        await txResponse.wait(1);
        const tokenURI: string = await basicNft.tokenURI(0);
        const TOKEN_URI: string = await basicNft.TOKEN_URI();
        const tokenCounter: BigNumber = await basicNft.getTokenCounter();

        assert.equal(tokenCounter.toString(), '1');
        assert.equal(tokenURI, TOKEN_URI);
      });
    });
