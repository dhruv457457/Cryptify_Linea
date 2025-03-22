require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // ✅ Load .env file

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // ✅ Optimization runs
      },
      viaIR: true, // ✅ Enable IR-based compilation to fix "Stack too deep" errors
    },
  },
  networks: {
    hardhat: {}, // ✅ Local Hardhat network
    linea_sepolia: {
      url: `https://linea-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`, // ✅ Linea Sepolia Testnet RPC
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // ✅ Load private key securely
      chainId: 59141, // ✅ Linea Sepolia Testnet Chain ID
    },
  },
};
