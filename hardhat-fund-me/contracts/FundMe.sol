// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.8;

// Imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// Error Codes
error FundMe__NotOwner();

// Interfaces
// Libraries
// Contracts

/** @title A Contract for crown funding
 *  @author Dibakar Sutra Dhar
 *  @notice This contract is to demo a sample funding contract
 *  @dev This implements PriceFeeds as our library
 */

contract FundMe {
  // Type Declarations
  using PriceConverter for uint256;

  // State Variables
  uint256 public constant MINIMUM_USD = 50 * 10**18;
  address private immutable i_owner;
  address[] private s_funders;
  mapping(address => uint256) private s_addressToAmountFunded;
  AggregatorV3Interface private s_priceFeed;

  // Modifiers
  modifier onlyOwner() {
    // revert(msg.sender == owner);
    if (msg.sender != i_owner) revert FundMe__NotOwner();
    _;
  }

  // Functions Order:
  /// constructor
  /// recieve
  /// fallback
  /// external
  /// public
  /// internal
  /// private
  /// view / pure

  constructor(address priceFeed) {
    s_priceFeed = AggregatorV3Interface(priceFeed);
    i_owner = msg.sender;
  }

  /// @notice Funds our contract based on the ETH/USD price
  function fund() public payable {
    require(
      msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
      "You need to spend more ETH!"
    );
    // revert(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
    s_addressToAmountFunded[msg.sender] += msg.value;
    s_funders.push(msg.sender);
  }

  function withdraw() public payable onlyOwner {
    for (
      uint256 funderIndex = 0;
      funderIndex < s_funders.length;
      funderIndex++
    ) {
      address funder = s_funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);
    // // transfer
    // payable(msg.sender).transfer(address(this).balance);
    // // send
    // bool sendSuccess = payable(msg.sender).send(address(this).balance);
    // revert(sendSuccess, "Send failed");
    // call
    (bool success, ) = i_owner.call{value: address(this).balance}("");
    require(success);
  }

  function cheaperWithdraw() public payable onlyOwner {
    address[] memory funders = s_funders;
    // mappings can't be in memory
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }

    s_funders = new address[](0);
    (bool success, ) = i_owner.call{value: address(this).balance}("");
    require(success);
  }

  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getFunder(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  /** @notice Gets the amount that an address has funded
   * @param  fundingAddress the address of the funder
   * @return the amount funded
   */
  function getAddressToAmountFunded(address fundingAddress)
    public
    view
    returns (uint256)
  {
    return s_addressToAmountFunded[fundingAddress];
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }
}
