// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {DecentralizedStablecoin} from "./DecentralizedStableCoin.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title DSCEngine
 * @author Dibakar
 *
 * The system is designed to be as minimal as possible and have the tokens maintain a 1 token == $1 peg.
 * The stablecoin has the properties:
 * - Exogenous Collatreal
 * - Dollar Pegged
 * - Algorithmically Stable
 *
 * It is similar to DAI if DAI had no governance, no fees, and was only backed by WETH and WBTC.
 *
 * Our DSC system should always be "over collateralized". At no point, should the value of
 * all collatreal <= the $ backed value of all the DSC.
 *
 * @notice This contract is the core of the DSC system. It handles all the logic for mintng
 * and redeeming DSC, as well as the depositing & withdrawing collatreal.
 * @notice This contract is Very loosely based on the MakerDAO DSS (DAI) system.
 *
 */

contract DSCEngine is ReentrancyGuard {
    // Errors
    error NeedsMoreThanZero();
    error TokenAddressesAndPriceFeedAddressesMustBeSameLength();
    error NotAllowedToken();
    error TransferFailed();

    // State Variables
    mapping(address token => address priceFeed) private s_priceFeeds; // tokenToPriceFeed
    mapping(address user => mapping(address token => uint256 amount)) private s_collatrealDeposited;

    DecentralizedStablecoin private immutable i_dsc;

    // Events
    event CollatrealDeposited(address indexed user, address indexed token, uint256 indexed amount);

    // Modifiers
    modifier moreThanZero(uint256 amount) {
        if (amount == 0) {
            revert NeedsMoreThanZero();
        }
        _;
    }

    modifier isAllowedToken(address token) {
        if (s_priceFeeds[token] == address(0)) {
            revert NotAllowedToken();
        }
        _;
    }

    // Functions
    constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscAddress) {
        // USD Price Feeds
        if (tokenAddresses.length != priceFeedAddresses.length) {
            revert TokenAddressesAndPriceFeedAddressesMustBeSameLength();
        }
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            s_priceFeeds[tokenAddresses[i]] = priceFeedAddresses[i];
        }
        i_dsc = DecentralizedStablecoin(dscAddress);
    }

    // External Functions
    function depositCollatrealAndMintDsc() external {}

    /**
     * @notice follows CEI
     * @param tokenCollatrealAddress The address of the token to deposit as collatreal
     * @param amountCollatreal The amount of collatreal to deposit
     */
    function depositCollatreal(address tokenCollatrealAddress, uint256 amountCollatreal)
        external
        moreThanZero(amountCollatreal)
        isAllowedToken(tokenCollatrealAddress)
        nonReentrant
    {
        s_collatrealDeposited[msg.sender][tokenCollatrealAddress] += amountCollatreal;
        emit CollatrealDeposited(msg.sender, tokenCollatrealAddress, amountCollatreal);
        bool success = IERC20(tokenCollatrealAddress).transferFrom(msg.sender, address(this), amountCollatreal);
        if (!success) {
            revert TransferFailed();
        }
    }

    function redeemCollatrealForDsc() external {}

    function redeemCollatreal() external {}

    function mintDsc() external {}

    function burnDsc() external {}

    function liquidate() external {}

    function healthFactor() external view {}
}
