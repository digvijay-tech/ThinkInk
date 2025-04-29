// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RechargeSystem {
    address public owner;
    uint256 public rechargeCost = 0.003 ether;

    event Recharged(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function recharge() external payable {
        require(msg.value == rechargeCost, "Incorrect amount sent");
        emit Recharged(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
