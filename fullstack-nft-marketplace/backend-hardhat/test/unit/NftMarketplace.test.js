const { expect, assert } = require('chai');
const { network, ethers, deployments } = require('hardhat');
const { developmentChains } = require('../../helper-hardhat-config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Nft Marketplace Unit Test', () => {
      let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract;
      const PRICE = ethers.utils.parseEther('0.1');
      const TOKEN_ID = 0;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
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
          ).to.emit('ItemListed');
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
          assert(listing.seller.toString() == deployer.address);
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
          await basicNft.approve(player.address, TOKEN_ID);
          await expect(
            nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.be.revertedWith('NftMarketplace__NotOwner');
        });

        it('emits an event and cancel listing', async () => {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          expect(
            await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
          ).to.emit('ItemCanceled');
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
          ).to.emit('ItemListed');
          const listing = await nftMarketplace.getListing(
            basicNft.address,
            TOKEN_ID
          );
          assert(listing.price.toString() == updatedPrice.toString());
        });
      });
    });
