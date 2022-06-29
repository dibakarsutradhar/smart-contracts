// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/** External Contracts */
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/** Error Event */
error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();
error NftMarketplace__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);

contract NftMarketplace {
    /** Mapping Structure */
    struct Listing {
        uint256 price;
        address seller;
    }

    /** Events */
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    /// @dev NFT Contract address -> NFT Token ID -> Listing
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    /// @dev Seller address -> Amount Earned
    mapping(address => uint256) private s_proceeds;

    /** Modifiers */
    /**
     * 	@notice Modifiers for the marketplace
     *	@notice Main use case of modifiers is for automatifally checking a condition, prior to execurting a function in this contract
     *	@notice If the function does not meet the modifier requirement, an exception is thrown, the function execution stops
     *	@param nftAddress: Address of the NFT
     *	@param tokenId: The token ID of the NFT
     *	@param owner: Owner of the listed NFT
     *	@param spender: Owner of the listed NFT
     */

    /// @dev notListed: Checks whether the NFT is already in the Marketplace
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    /// @dev isOwner: Checks if the current spender is the actual owner of the listed NFT
    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    /// @dev isListed: Checks whether the NFT is in the Marketplace
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    /** Main Functions */
    /**
     * 	@notice Method for listing you NFT on the marketplace
     *	@param nftAddress: Address of the NFT
     *	@param tokenId: The token ID of the NFT
     *	@param price: Sale price of the listed NFT
     *	@dev Technically, we could have the contract to be the escrow for the NFTs, cons are Expensive Gas
     *	@dev However, this way people can still hold their NFTs when listed.
     */

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert NftMarketplace__PriceNotMet(
                nftAddress,
                tokenId,
                listedItem.price
            );
        }
        s_proceeds[listedItem.seller] =
            s_proceeds[listedItem.seller] +
            msg.value;
        delete (s_listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }
}