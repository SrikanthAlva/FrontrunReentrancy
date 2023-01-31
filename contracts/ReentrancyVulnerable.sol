// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ReentrancyVulnerable is Pausable, Ownable {
    mapping(address => uint) public balances;

    event Withdraw(address indexed caller, uint256 indexed amount);

    function deposit() public payable whenNotPaused {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public whenNotPaused {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
        emit Withdraw(msg.sender, bal);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
