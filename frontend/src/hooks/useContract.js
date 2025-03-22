import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";

const FUND_TRANSFER_ADDRESS = "0x33f751a60879825e0F3c386F9fdB0dD506fB31e7";

const useContract = () => {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setUserAddress(address);
          fetchBalance(address);
          fetchUserTransactions(address);
        } catch (error) {
          console.error("Error fetching user account:", error);
        }
      }
    };
    fetchAccount();
  }, []);

  // 🔹 Get FundTransfer Contract
  const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask is not installed!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(FUND_TRANSFER_ADDRESS, FundTransferWithRegistryABI.abi, signer);
  };

  
  // 🔹 Get CryptifyFreelance Contract
 

  // 🔹 Fetch Transactions
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const contract = await getContract();
      const txs = await contract.getAllTransactions();
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fetch User Transactions
  const fetchUserTransactions = async (address) => {
    if (!address) return;
    try {
      const contract = await getContract();
      const userTxs = await contract.getUserTransactions(address);
      setUserTransactions(userTxs);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
    }
  };

  // 🔹 Fetch Balance
  const fetchBalance = async (address) => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      setBalance(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

 
 

  return { 
    getContract, 
    userAddress, 
    balance, 
    transactions, 
    fetchTransactions, 
    fetchBalance, 
    userTransactions,
    fetchUserTransactions,
  };
};

export default useContract;