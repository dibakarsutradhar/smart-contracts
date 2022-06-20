const { assert } = require('chai');
const { network, ethers, deployments } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Basic NFT Unit Tests', () => {
      let basicNft, deployer;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(['mocks', 'basicnft']);
        basicNft = await ethers.getContract('BasicNFT');
      });

      it('Allows users to mint an NFT, and updates appropriately', async () => {
        const txResponse = await basicNft.mintNft();
        await txResponse.wait(1);
        const tokenURI = await basicNft.tokenURI(0);
        const TOKEN_URI = await basicNft.TOKEN_URI();
        const tokenCounter = await basicNft.getTokenCounter();

        assert.equal(tokenCounter.toString(), '1');
        assert.equal(tokenURI, TOKEN_URI);
      });
    });
