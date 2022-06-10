const { assert, expect } = require('chai');
const { network, getNamedAccounts, deployments, ethers } = require('hardhat');
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config');

developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle Staging Test', () => {
      let raffle, raffleEntranceFee, deployer;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract('Raffle', deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });

      describe('fulfillRandomWords', () => {
        it('works with live Chainlink keepers and Chainlink VRF, we get a random winner', async () => {
          // Enter the raffle
          const startingTimeStamp = await raffle.getLatestTimeStamp();
          const accounts = await ethers.getSigners();

          // setup the listener
          await new Promise(async (resolve, reject) => {
            raffle.once('WinnerPicked', async () => {
              console.log('WinnerPicked event fired !');
              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLatestTimeStamp();

                await expect(raffle.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(raffleState, 0);
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee).toString()
                );
                assert(endingTimeStamp > startingTimeStamp);
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
              resolve();
            });
            // Then entering the raffle
            await raffle.enterRaffle({ value: raffleEntranceFee });
            const winnerStartingBalance = await accounts[0].getBalance();

            // and this code wont complete until our listener has finished listenting
          });
        });
      });
    });
