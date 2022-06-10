const { assert, expect } = require('chai');
const { network, getNamedAccounts, deployments, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle Unit Test', () => {
      let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval;
      const chainId = network.config.chainId;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);
        raffle = await ethers.getContract('Raffle', deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          'VRFCoordinatorV2Mock',
          deployer
        );
        raffleEntranceFee = await raffle.getEntranceFee();
        interval = await raffle.getInterval();
      });

      describe('constructor', () => {
        it('initializes the raffle contract', async () => {
          // Ideally we make our tests have just 1 assert per 'it'
          const raffleState = await raffle.getRaffleState();
          assert.equal(raffleState.toString(), '0');
          assert.equal(
            interval.toString(),
            networkConfig[chainId]['keepersUpdateInterval']
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
          assert.equal(playerFromContract, deployer);
        });

        it('emits event on enter', async () => {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.emit(raffle, 'RaffleEnter');
        });

        it("doesn't allow entrance when Raffle is calculating", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.send('evm_mine', []);
          // We pretend to be a Chainlink keeper
          await raffle.performUpkeep([]);
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.be.revertedWith('Raffle__NotOpen');
        });
      });

      describe('checkUpkeep', () => {
        it("returns false if people haven't sent any ETH", async () => {
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.send('evm_mine', []);
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });

        it('returns false if raffle is not open', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.send('evm_mine', []);
          await raffle.performUpkeep([]);
          const raffleState = await raffle.getRaffleState();
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
          assert.equal(raffleState.toString(), '1');
          assert.equal(upkeepNeeded, false);
        });

        it("returns false if enough time hasn't passed", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() - 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x');
          assert(!upkeepNeeded);
        });

        it('returns true if enough time has passed, has players, eth, and is open', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep('0x');
          assert(upkeepNeeded);
        });
      });

      describe('performUpkeep', () => {
        it('it can only run if checkupkeep is true', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
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
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
          await network.provider.request({ method: 'evm_mine', params: [] });
          const txResponse = await raffle.performUpkeep([]);
          const txReceipt = await txResponse.wait(1);
          const requestId = txReceipt.events[1].args.requestId;
          const raffleState = await raffle.getRaffleState();
          assert(requestId.toNumber() > 0);
          assert(raffleState.toString() == '1');
        });
      });

      describe('fulfillRandomWords', () => {
        beforeEach(async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send('evm_increaseTime', [
            interval.toNumber() + 1,
          ]);
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
          const startingAccountIndex = 1;
          const accounts = await ethers.getSigners();
          for (
            let i = startingAccountIndex;
            i < startingAccountIndex + additionalEntrants;
            i++
          ) {
            const accountConnectedRaffle = raffle.connect(accounts[i]);
            await accountConnectedRaffle.enterRaffle({
              value: raffleEntranceFee,
            });
          }
          const startingTimeStamp = await raffle.getLatestTimeStamp();

          // performupkeep (mock being chainlink keepers)
          // fulfillRandomWords (mock being Chainlink VRF)
          // We will have to wait for the fulfillRandomWords to be called
          await new Promise(async (resolve, reject) => {
            raffle.once('WinnerPicked', async () => {
              console.log('found the event!');
              try {
                const recentWinner = await raffle.getRecentWinner();
                console.log(`winner is ${recentWinner}`);
                console.log(accounts[2].address);
                console.log(accounts[0].address);
                console.log(accounts[1].address);
                console.log(accounts[3].address);
                const raffleState = await raffle.getRaffleState();
                const endingTimeStamp = await raffle.getLatestTimeStamp();
                const numPlayers = await raffle.getNumberOfPlayers();
                const winnerEndingsBalance = await accounts[1].getBalance();

                assert.equal(numPlayers.toString(), '0');
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
            const tx = await raffle.performUpkeep([]);
            const txReceipt = await tx.wait(1);
            const winnerStartingBalance = await accounts[1].getBalance();
            await vrfCoordinatorV2Mock.fulfillRandomWords(
              txReceipt.events[1].args.requestId,
              raffle.address
            );
          });
        });
      });
    });
