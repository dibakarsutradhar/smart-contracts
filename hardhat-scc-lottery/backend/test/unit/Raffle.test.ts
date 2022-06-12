import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert, expect } from 'chai';
import { BigNumber } from 'ethers';
import { deployments, ethers, network } from 'hardhat';
import { developmentChains, networkConfig } from '../../helper-hardhat-config';
import { Raffle, VRFCoordinatorV2Mock } from '../../typechain-types';

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle Unit Test', () => {
      let raffle: Raffle;
      let raffleContract: Raffle;
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;
      let raffleEntranceFee: BigNumber;
      let interval: number;
      let player: SignerWithAddress;
      let accounts: SignerWithAddress[];

      beforeEach(async () => {
        // deployer = (await getNamedAccounts()).deployer;
        accounts = await ethers.getSigners();
        player = accounts[1];
        await deployments.fixture(['mocks', 'raffle']);
        vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
        raffleContract = await ethers.getContract('Raffle');
        raffle = raffleContract.connect(player);
        raffleEntranceFee = await raffle.getEntranceFee();
        interval = (await raffle.getInterval()).toNumber();
      });

      describe('constructor', () => {
        it('initializes the raffle contract', async () => {
          console.log(network.config.chainId);
          // Ideally we make our tests have just 1 assert per 'it'
          const raffleState = (await raffle.getRaffleState()).toString();
          assert.equal(raffleState, '0');
          assert.equal(
            interval.toString(),
            networkConfig[network.config.chainId!]['keepersUpdateInterval']
          );
        });
      });

      describe('enterRaffle', () => {
        it("reverts when you don't pay enough", async () => {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            'Raffle__NotEnoughETHEntered'
          );
        });

        it('records players when they enter', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const playerFromContract = await raffle.getPlayer(0);
          assert.equal(playerFromContract, player.address);
        });

        it('emits event on enter', async () => {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.emit(raffle, 'RaffleEnter');
        });

        it("doesn't allow entrance when Raffle is calculating", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [interval + 1]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          // We pretend to be a Chainlink keeper
          await raffle.performUpkeep([]);
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.be.revertedWith('Raffle__NotOpen');
        });
      });

      describe('checkUpkeep', () => {
        it("returns false if people haven't sent any ETH", async () => {
          await network.provider.send('evm_increaseTime', [interval + 1]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x');
          assert(!upkeepNeeded);
        });

        it('returns false if raffle is not open', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [interval + 1]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          await raffle.performUpkeep([]);
          const raffleState = await raffle.getRaffleState();
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x');
          assert.equal(raffleState.toString(), '1');
          assert.equal(upkeepNeeded, false);
        });

        it("returns false if enough time hasn't passed", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [interval - 1]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x');
          assert(!upkeepNeeded);
        });

        it('returns true if enough time has passed, has players, eth, and is open', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [interval + 1]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x');
          assert(upkeepNeeded);
        });
      });

      describe('performUpkeep', () => {
        it('it can only run if checkupkeep is true', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [interval + 1]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const tx = await raffle.performUpkeep([]);
          assert(tx);
        });

        it('reverts when checkupkeep is false', async () => {
          await expect(raffle.performUpkeep([])).to.be.revertedWith(
            'Raffle_UpKeepNotNeeded'
          );
        });

        it('updates the raffleState, emits an event, and calls the vrf coordinator', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [interval + 1]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const txResponse = await raffle.performUpkeep([]);
          const txReceipt = await txResponse.wait(1);
          const raffleState = await raffle.getRaffleState();
          const requestId = txReceipt!.events![1].args!.requestId;
          assert(requestId.toNumber() > 0);
          assert(raffleState == 1);
        });
      });

      describe('fulfillRandomWords', () => {
        beforeEach(async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [interval + 1]);
          await network.provider.request({ method: 'evm_mine', params: [] });
        });

        it('can only be called after perfomUpkeep', async () => {
          await expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address)
          ).to.be.revertedWith('nonexistent request');
          await expect(
            vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address)
          ).to.be.revertedWith('nonexistent request');
        });

        it('picks a winner, resets the lottery and sends money', async () => {
          const additionalEntrants = 3;
          const startingAccountIndex = 2;

          for (
            let i = startingAccountIndex;
            i < startingAccountIndex + additionalEntrants;
            i++
          ) {
            raffle = raffle.connect(accounts[i]);
            await raffle.enterRaffle({
              value: raffleEntranceFee,
            });
          }
          const startingTimeStamp = await raffle.getLatestTimeStamp();

          // performupkeep (mock being chainlink keepers)
          // fulfillRandomWords (mock being Chainlink VRF)
          // We will have to wait for the fulfillRandomWords to be called
          await new Promise<void>(async (resolve, reject) => {
            raffle.once('WinnerPicked', async () => {
              console.log('WinnerPicked event fired!');
              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const endingTimeStamp = await raffle.getLatestTimeStamp();
                const winnerEndingsBalance = await accounts[2].getBalance();

                await expect(raffle.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner.toString(), accounts[2].address);
                assert.equal(raffleState.toString(), '0');
                assert(endingTimeStamp > startingTimeStamp);
                assert.equal(
                  winnerEndingsBalance.toString(),
                  winnerStartingBalance
                    .add(raffleEntranceFee.mul(additionalEntrants))
                    .add(raffleEntranceFee)
                    .toString()
                );
              } catch (e) {
                reject(e);
              }
              resolve();
            });
            // Setting up the listener
            // below, we will fire the event, and the listener will pick it up, and resolve
            const tx = await raffle.performUpkeep('0x');
            const txReceipt = await tx.wait(1);
            const winnerStartingBalance = await accounts[2].getBalance();
            await vrfCoordinatorV2Mock.fulfillRandomWords(
              txReceipt!.events![1].args!.requestId,
              raffle.address
            );
          });
        });
      });
    });
