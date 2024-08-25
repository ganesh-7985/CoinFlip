const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoinFlip", function () {
  let coinFlip;
  let deployer;
  let player;

  beforeEach(async function () {
    [deployer, player] = await ethers.getSigners();

    const CoinFlip = await ethers.getContractFactory("CoinFlip");
    coinFlip = await CoinFlip.deploy();
    await coinFlip.deployed();
  });

  it("should allow a player to bet and win", async function () {
    // Simulate a bet by sending 1 ETH and guessing "heads" (true)
    const betAmount = ethers.utils.parseEther("1");

    // Mock block.timestamp to ensure the outcome is predictable
    const block = await ethers.provider.getBlock();
    const isHeads = (block.timestamp % 2 === 0);

    // Player sends a transaction to flip the coin
    const tx = await coinFlip.connect(player).flip(isHeads, { value: betAmount });
    await tx.wait();

    // Validate the player's balance has doubled
    const finalBalance = await ethers.provider.getBalance(player.address);
    expect(finalBalance).to.be.above(betAmount.mul(2));
  });

  it("should allow a player to bet and lose", async function () {
    // Simulate a bet by sending 1 ETH and guessing "tails" (false)
    const betAmount = ethers.utils.parseEther("1");

    // Mock block.timestamp to ensure the outcome is predictable
    const block = await ethers.provider.getBlock();
    const isHeads = (block.timestamp % 2 !== 0);

    // Player sends a transaction to flip the coin
    const tx = await coinFlip.connect(player).flip(!isHeads, { value: betAmount });
    await tx.wait();

    // Validate the player's balance has not increased
    const finalBalance = await ethers.provider.getBalance(player.address);
    expect(finalBalance).to.be.below(betAmount);
  });

  it("should emit a CoinFlipped event", async function () {
    const betAmount = ethers.utils.parseEther("1");
    const block = await ethers.provider.getBlock();
    const isHeads = (block.timestamp % 2 === 0);

    await expect(coinFlip.connect(player).flip(isHeads, { value: betAmount }))
      .to.emit(coinFlip, "CoinFlipped")
      .withArgs(player.address, betAmount, true);
  });

  it("should revert if no ETH is sent", async function () {
    await expect(
      coinFlip.connect(player).flip(true, { value: 0 })
    ).to.be.revertedWith("You need to bet some ETH");
  });
});
