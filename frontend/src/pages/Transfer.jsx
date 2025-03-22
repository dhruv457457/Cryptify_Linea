import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import useContract from "../hooks/useContract";
import { ethers } from "ethers";
import TransferForm from "../components/TransferForm";
import TransactionList from "../components/TransactionList";
import FundTransferWithRegistryABI from "../contracts/FundTransferWithRegistry.json";

const fundTransferAddress = "0x33f751a60879825e0F3c386F9fdB0dD506fB31e7";

const Transfer = () => {
  const { transactions, fetchTransactions, getContract, userAddress } = useContract();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userAddress) {
      fetchTransactions();
    }
  }, [userAddress]);

  const validateInputs = () => {
    if (!recipient || recipient.trim() === "") {
      toast.error("❌ Enter a valid recipient username or address!");
      return false;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("❌ Please enter a valid amount!");
      return false;
    }
    return true;
  };

  const sendFunds = async () => {
    if (!window.ethereum) {
      toast.error("🦊 Please install MetaMask!");
      return;
    }
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const contract = await getContract(fundTransferAddress, FundTransferWithRegistryABI.abi);

      if (!contract) {
        toast.error("❌ Contract instance not found!");
        return;
      }

      const amountInWei = ethers.parseEther(amount);
      console.log(`💰 Sending ${amount} ETH to ${recipient}...`);

      const tx = await contract.sendFunds(recipient, message, { value: amountInWei });
      console.log("🔄 Transaction sent. Waiting for confirmation...");
      await tx.wait();

      toast.success(`✅ Transfer successful! TX: ${tx.hash}`);
      setRecipient("");
      setAmount("");
      setMessage("");

      fetchTransactions();
    } catch (error) {
      console.error("❌ Transaction error:", error);
      toast.error(`❌ Transaction failed! ${error.reason || error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex flex-col bg-customSemiPurple justify-between md:flex-row py-20">
        <TransferForm
          recipient={recipient}
          setRecipient={setRecipient}
          amount={amount}
          setAmount={setAmount}
          message={message}
          setMessage={setMessage}
          sendFunds={sendFunds}
          loading={loading}
        />
        <TransactionList transactions={transactions} userAddress={userAddress} />
      </div>
    </>
  );
};

export default Transfer;