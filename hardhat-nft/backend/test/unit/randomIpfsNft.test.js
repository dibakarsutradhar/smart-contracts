const { assert, expect } = require('chai');
const { network, ethers, deployments } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Random IPFS NFT Unit Tests', () => {
      let randomIpfsNft, deployer, vrfCoordinatorV2Mock;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(['mocks', 'randomipfs']);
        randomIpfsNft = await ethers.getContract('RandomIPFSNft');
        vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
      });

      describe('constructor', () => {
        it('sets starting values correctly', async () => {
          const dogTokenUriZero = await randomIpfsNft.getDogTokenUri(0);
          const isInitialized = await randomIpfsNft.getInitialized();

          assert(dogTokenUriZero.includes('ipfs://'));
          assert.equal(isInitialized, true);
        });
      });

      describe('requestNFT', () => {
        it("fails if payment isn't sent with the request", async () => {
          await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
            'RandomIPFSNft__NeedMoreETHSent'
          );
        });

        it('emits and event and kicks off a random word request', async () => {
          const fee = await randomIpfsNft.getMintFee();
          await expect(
            randomIpfsNft.requestNft({
              value: fee.toString(),
            })
          ).to.emit(randomIpfsNft, 'NftRequested');
        });
      });

      describe('fulfillRandomWords', () => {
        it('mints NFT after random number returned', async () => {
          await new Promise(async (resolve, reject) => {
            randomIpfsNft.once('NftMinted', async () => {
              try {
                const tokenUri = await randomIpfsNft.tokenURI(0);
                const tokenCounter = await randomIpfsNft.getTokenCounter();

                assert.equal(tokenUri.toString().includes('ipfs://'), true);
                assert.equal(tokenCounter.toString(), '1');
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            });

            try {
              const fee = await randomIpfsNft.getMintFee();
              const requestNftResponse = await randomIpfsNft.requestNft({
                value: fee.toString(),
              });
              const requestNftReceipt = await requestNftResponse.wait(1);
              await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestNftReceipt.events[1].args.requestId,
                randomIpfsNft.address
              );
            } catch (e) {
              console.log(e);
              reject(e);
            }
          });
        });
      });
    });
