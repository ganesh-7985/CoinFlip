require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
