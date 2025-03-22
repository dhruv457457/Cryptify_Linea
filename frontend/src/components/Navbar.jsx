import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { FaBars, FaTimes, FaWallet, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";

function Navbar() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const alertTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setWalletAddress(storedAddress);
      checkChainId();
    }
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const showCustomAlert = () => {
    setShowAlert(true);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    alertTimeoutRef.current = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const checkChainId = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const chainId = network.chainId;
        
        if (chainId.toString() !== "59141") {
          showCustomAlert();
          return false;
        }
        return true;
      } catch (error) {
        console.error("Failed to check chain ID", error);
        return false;
      }
    }
    return false;
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
        const isCorrectChain = await checkChainId();
        if (!isCorrectChain) {
          console.log("Not connected to Linea Sepolia");
        }
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== '0xe6f4') { // 0xe6f4 is the hex representation of 59140
          showCustomAlert();
        }
      });
    }
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [navigate]);

  return (
    <>
      {showAlert && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-11/12 md:w-auto">
          <div className="bg-customDarkpurple border-2 border-customPurple rounded-lg shadow-lg px-6 py-4 flex flex-col md:flex-row items-center gap-4 backdrop-blur-sm bg-opacity-95 animate-fadeIn">
            <FaExclamationTriangle className="text-yellow-300 text-3xl flex-shrink-0" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-white font-bold text-lg mb-1">Wrong Network Detected</h3>
              <p className="text-gray-300 text-sm mb-3">
                Please connect to the Linea Sepolia (Chain ID: 59141) to use this application.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button 
                  className="bg-gradient-to-r from-customPurple to-customBlue py-2 px-4 rounded-md text-white font-medium hover:opacity-90 transition-all"
                >
                  Switch Network
                </button>
                <button 
                  onClick={() => setShowAlert(false)} 
                  className="text-gray-300 py-2 px-4 rounded-md border border-gray-600 hover:bg-gray-800 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 w-full bg-customDarkpurple bg-opacity-90 backdrop-blur-sm shadow-lg px-8 sm:px-10 py-4 text-white flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-customPurple via-customBlue to-customBlue2 text-transparent bg-clip-text">
          Cryptify
        </h1>

        <div className="hidden md:flex gap-10 items-center text-base">
          <Link to="/" className="hover:text-customBlue2 transition duration-300">Home</Link>
          <Link to="/contract" className="hover:text-customBlue2 transition duration-300">Contract</Link>
          <Link to="/docs" className="hover:text-customBlue2 transition duration-300">Docs</Link>
          <Link to="/transfer" className="hover:text-customBlue transition duration-300">Transfer</Link>
          <Link to="/user" className="hover:text-customBlue transition duration-300">Profile</Link>
          <div className="relative">
            {walletAddress ? (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded text-customLightPurple font-semibold border-b-4 border-customLightPurple transition duration-300">
                <FaWallet className="text-customLightPurple" />
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                <button onClick={disconnectWallet} className="ml-2 text-red-500 hover:text-red-700">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="flex items-center gap-2 px-4 py-2 rounded font-semibold bg-white text-customLightPurple border-b-4 border-customLightPurple transition-all">
                <FaWallet /> Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;