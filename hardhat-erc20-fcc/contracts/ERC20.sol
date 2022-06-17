// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OurERC20 is ERC20 {
    constructor(uint256 initialSupply) ERC20("OurERC20", "OT") {
        _mint(msg.sender, initialSupply);
    }
}
