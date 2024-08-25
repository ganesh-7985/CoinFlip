// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    uint256 public constant MIN_BET = 0.001 ether;
    uint256 private contractBalance;

    struct Player {
        uint256 balance;
        uint256 betAmount;
        uint256 betChoice;
        bool betOngoing;
    }

    mapping(address => Player) public players;

    event DepositToContract(address indexed user, uint256 indexed depositAmount, uint256 newBalance);
    event Withdrawal(address indexed player, uint256 amount);
    event BetPlaced(address indexed player, uint256 betChoice, uint256 betAmount);
    event BetResult(address indexed player, bool victory, uint256 amount);
    event ContractBalanceWithdrawn(address indexed owner, uint256 amount);

    constructor() payable {
        require(msg.value >= 0.1 ether, "Contract needs initial ETH");
        contractBalance += msg.value;
    }

    function bet(uint256 _betChoice) public payable {
        require(msg.value >= MIN_BET, "Insufficient bet amount");
        require(msg.value <= getContractBalance() / 2, "Bet amount too large");
        require(_betChoice == 0 || _betChoice == 1, "Invalid bet choice");

        Player storage player = players[msg.sender];
        require(!player.betOngoing, "Bet already ongoing");

        player.betChoice = _betChoice;
        player.betAmount = msg.value;
        player.betOngoing = true;

        contractBalance += msg.value;

        emit BetPlaced(msg.sender, _betChoice, msg.value);

        uint256 randomResult = block.timestamp % 2;
        checkResult(randomResult);
    }

    function withdrawPlayerBalance() public {
        Player storage player = players[msg.sender];
        require(!player.betOngoing, "Bet ongoing");
        require(player.balance > 0, "No funds to withdraw");

        uint256 amount = player.balance;
        player.balance = 0;

        (bool success, ) = payable(msg.sender).call{ value: amount }("");
        require(success, "Withdraw failed");

        emit Withdrawal(msg.sender, amount);
    }

    function deposit() public payable {
        require(msg.value > 0, "Insufficient deposit amount");
        contractBalance += msg.value;
        emit DepositToContract(msg.sender, msg.value, contractBalance);
    }

    function getPlayerBalance() public view returns (uint256) {
        return players[msg.sender].balance;
    }

    function getContractBalance() public view returns (uint256) {
        return contractBalance;
    }

    function checkResult(uint256 _randomResult) private {
        Player storage player = players[msg.sender];

        bool win = false;
        uint256 amountWon = 0;

        if (player.betChoice == _randomResult) {
            win = true;
            amountWon = player.betAmount * 2;
            player.balance += amountWon;
            contractBalance -= amountWon;
        }

        player.betAmount = 0;
        player.betOngoing = false;

        emit BetResult(msg.sender, win, amountWon);
    }

    function withdrawContractBalance() public {
        require(contractBalance > 0, "No funds to withdraw");

        uint256 toTransfer = contractBalance;
        contractBalance = 0;
        (bool success, ) = payable(msg.sender).call{ value: toTransfer }("");
        require(success, "Withdraw failed");

        emit ContractBalanceWithdrawn(msg.sender, toTransfer);
    }
}