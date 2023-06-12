// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC20Burnable, ERC20} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Decentralized StableCoin
 * @author Dibakar
 * Collatreal: Exogenous (ETH & BTC)
 * Minting: Algorithmic
 * Relative Stability: Pegged to USD
 *
 * This is the contract meant to be governed by DSCEngine. This contract is just the ERC20 implementation
 * of the stablecoin system.
 *
 */

contract DecentralizedStablecoin is ERC20Burnable, Ownable {
    error MustBeMoreThanZero();
    error BurnAmountExceedsBalance();
    error NotZeroAddress();

    constructor() ERC20("DecentralizedStablecoin", "DSC") {}

    function burn(uint256 _amount) public override onlyOwner {
        uint256 balance = balanceOf(msg.sender);
        if (_amount <= 0) {
            revert MustBeMoreThanZero();
        }
        if (balance < _amount) {
            revert BurnAmountExceedsBalance();
        }
        super.burn(_amount);
    }

    function mint(
        address _to,
        uint256 _amount
    ) external onlyOwner returns (bool) {
        if (_to == address(0)) {
            revert NotZeroAddress();
        }
        if (_amount <= 0) {
            revert MustBeMoreThanZero();
        }
        _mint(_to, _amount);
        return true;
    }
}
