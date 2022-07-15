import { assert, expect } from 'chai';
import { BigNumber, Signer } from 'ethers';
import { deployments, ethers, network } from 'hardhat';
import { developmentChains } from '../../helper-hardhat-config';
import { BasicNFT, NftMarketplace } from '../../typechain-types';

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Nft Marketplace Unit Test', () => {
      let nftMarketplace: NftMarketplace,
        nftMarketplaceContract: NftMarketplace,
        basicNft: BasicNFT,
        basicNftContract: BasicNFT;
      const PRICE: BigNumber = ethers.utils.parseEther('0.1');
      const TOKEN_ID: number = 0;
      let deployer: Signer;
      let player: Signer;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        player = accounts[1];
        await deployments.fixture(['all']);
        nftMarketplaceContract = await ethers.getContract('NftMarketplace');
        nftMarketplace = nftMarketplaceContract.connect(deployer);
        basicNftContract = await ethers.getContract('BasicNFT');
        basicNft = basicNftContract.connect(deployer);
        await basicNft.mintNft();
        await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID);
      });

      describe('listItem', () => {
        it('emits an event after listing an item', async () => {
          expect(
            await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.emit(nftMarketplace, 'ItemListed');
        });

        it("exclusively items that haven't been listed", async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          const error = `NftMarketplace__AlreadyListed("${basicNft.address}", ${TOKEN_ID})`;
          await expect(
            nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith(error);
        });

        it('needs approvals to list item', async () => {
          await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID);
          await expect(
            nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith('NftMarketplace__NotApprovedForMarketplace');
        });

        it('updates listing with seller and price', async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          const listing = await nftMarketplace.getListing(
            basicNft.address,
            TOKEN_ID
          );
          assert(listing.price.toString() == PRICE.toString());
          assert(listing.seller.toString() == (await deployer.getAddress()));
        });
      });

      describe('cancelListing', () => {
        it('reverts if there is no listing', async () => {
          const error = `NftMarketplace__NotListed("${basicNft.address}", ${TOKEN_ID})`;
          await expect(
            nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith(error);
        });

        it('reverts if not owner', async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          nftMarketplace = nftMarketplaceContract.connect(player);
          await basicNft.approve(await player.getAddress(), TOKEN_ID);
          await expect(
            nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith('NftMarketplace__NotOwner');
        });

        it('emits an event and cancel listing', async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          expect(
            await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.emit(nftMarketplace, 'ItemCanceled');
          const listing = await nftMarketplace.getListing(
            basicNft.address,
            TOKEN_ID
          );
          assert(listing.price.toString() == '0');
        });
      });

      describe('updateListing', () => {
        it('reverts if not owner', async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          nftMarketplace = nftMarketplaceContract.connect(player);
          await expect(
            nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith('NftMarketplace__NotOwner');
        });

        it('reverts if not listed', async () => {
          const error = `NftMarketplace__NotListed("${basicNft.address}", ${TOKEN_ID})`;
          await expect(
            nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
          ).to.be.revertedWith(error);
        });

        it('updates the price of the item', async () => {
          const updatedPrice = ethers.utils.parseEther('0.2');
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          expect(
            await nftMarketplace.updateListing(
              basicNft.address,
              TOKEN_ID,
              updatedPrice
            )
          ).to.emit(nftMarketplace, 'ItemListed');
          const listing = await nftMarketplace.getListing(
            basicNft.address,
            TOKEN_ID
          );
          assert(listing.price.toString() == updatedPrice.toString());
        });
      });

      describe('buyItem', () => {
        it('reverts if not listed', async () => {
          await expect(
            nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith('NftMarketplace__NotListed');
        });

        it('reverts if the price did not met', async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          await expect(
            nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith('NftMarketplace__PriceNotMet');
        });

        it('transfers the nft to the buyer and updates internal proceeds record', async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          nftMarketplace = nftMarketplaceContract.connect(player);
          expect(
            await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
              value: PRICE,
            })
          ).to.emit(nftMarketplace, 'ItemBought');
          const newOwner = await basicNft.ownerOf(TOKEN_ID);
          const deployerProceeds = await nftMarketplace.getProceeds(
            await deployer.getAddress()
          );
          assert(newOwner.toString() == (await player.getAddress()));
          assert(deployerProceeds.toString() == PRICE.toString());
        });
      });

      describe('withdrawProceeds', () => {
        it("doesn't allow 0 proceed withdraws", async () => {
          await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
            'NftMarketplace__NoProceeds'
          );
        });

        it('withdraw proceeds', async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          nftMarketplace = nftMarketplaceContract.connect(player);
          await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
            value: PRICE,
          });
          nftMarketplace = nftMarketplaceContract.connect(deployer);

          const prevDeployerProceeds = await nftMarketplace.getProceeds(
            await deployer.getAddress()
          );
          const prevDeployerBalance = await deployer.getBalance();
          const txResponse = await nftMarketplace.withdrawProceeds();
          const txReceipt = await txResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const newDeployerBalance = await deployer.getBalance();

          assert(
            newDeployerBalance.add(gasCost).toString() ==
              prevDeployerProceeds.add(prevDeployerBalance).toString()
          );
        });
      });
    });
