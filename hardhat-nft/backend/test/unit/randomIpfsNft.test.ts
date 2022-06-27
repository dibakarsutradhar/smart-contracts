import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert, expect } from 'chai';
import { BigNumber, ContractReceipt, ContractTransaction } from 'ethers';
import { PathLike } from 'fs-extra';
import { deployments, ethers, network } from 'hardhat';
import { developmentChains } from '../../helper-hardhat-config';
import { RandomIPFSNft, VRFCoordinatorV2Mock } from '../../typechain-types/';

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Random IPFS NFT Unit Tests', () => {
      let randomIpfsNft: RandomIPFSNft,
        deployer: SignerWithAddress,
        vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;

      beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(['mocks', 'randomipfs']);
        randomIpfsNft = await ethers.getContract('RandomIPFSNft');
        vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
      });

      describe('constructor', () => {
        it('sets starting values correctly', async () => {
          const dogTokenUriZero: PathLike = await randomIpfsNft.getDogTokenUri(
            0
          );
          const isInitialized: boolean = await randomIpfsNft.getInitialized();

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
          const fee: BigNumber = await randomIpfsNft.getMintFee();
          await expect(
            randomIpfsNft.requestNft({
              value: fee.toString(),
            })
          ).to.emit(randomIpfsNft, 'NftRequested');
        });
      });

      describe('fulfillRandomWords', () => {
        it('mints NFT after random number returned', async () => {
          await new Promise<void>(async (resolve, reject) => {
            randomIpfsNft.once('NftMinted', async () => {
              try {
                const tokenUri: string = await randomIpfsNft.tokenURI(0);
                const tokenCounter: BigNumber =
                  await randomIpfsNft.getTokenCounter();

                assert.equal(tokenUri.toString().includes('ipfs://'), true);
                assert.equal(tokenCounter.toString(), '1');
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            });

            try {
              const fee: BigNumber = await randomIpfsNft.getMintFee();
              const requestNftResponse: ContractTransaction =
                await randomIpfsNft.requestNft({
                  value: fee.toString(),
                });
              const requestNftReceipt: ContractReceipt =
                await requestNftResponse.wait(1);
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
