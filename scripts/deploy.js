async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const initialBalance = await deployer.getBalance();
  console.log("Account balance:", initialBalance.toString());

  const CoinFlip = await ethers.getContractFactory("CoinFlip");
  const coinFlip = await CoinFlip.deploy({ value: ethers.utils.parseEther("0.1") });

  console.log("CoinFlip contract deployed to:", coinFlip.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });