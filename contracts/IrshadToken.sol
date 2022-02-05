// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract IrshadToken is ERC20 {
    constructor() public ERC20("Irshad", "IRSD") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
