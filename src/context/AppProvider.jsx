import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../utils/blockchain';

export const AppContext = createContext();

const createEthereumContract = () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  }
  return null;
};

// Provider component that wraps your app
export const AppProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [isHeads, setIsHeads] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const fetchTransactions = async () => {
    if (walletAddress) {
      try {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        const data = await response.json();
        if (Array.isArray(data.result)) setTransactions(data.result);
        else setTransactions([]);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setMessage(error.message);
      }
    }
  };

  const flipCoin = async () => {
    if (!walletAddress) return alert("Please connect your wallet first!");
    if (!isMetaMaskInstalled) return alert("Please install MetaMask!");
    try {
      const contract = createEthereumContract();
      if (!contract) throw new Error("Failed to create Ethereum contract");
      const balance = await contract.provider.getBalance(walletAddress);
      const betAmountWei = ethers.utils.parseEther(betAmount);
      if (balance.lt(betAmountWei)) {
        setMessage("Insufficient funds for this bet.");
        return;
      }
      const tx = await contract.flip(isHeads, { value: betAmountWei });
      setMessage("Transaction sent. Waiting for confirmation...");
      const receipt = await tx.wait();
      if (receipt.status === 1) setMessage("Coin flip complete!");
      else setMessage("Transaction failed.");
    } catch (error) {
      console.error("Transaction failed:", error);
      setMessage(`Coin flip failed: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [walletAddress]);

  useEffect(() => {
    setIsMetaMaskInstalled(typeof window.ethereum !== 'undefined');
  }, []);

  return (
    <AppContext.Provider value={{
      walletAddress,
      setWalletAddress,
      flipCoin,
      betAmount,
      setBetAmount,
      isHeads,
      setIsHeads,
      transactions,
      isLoading,
      message,
      isMetaMaskInstalled,
    }}>
      {children}
    </AppContext.Provider>
  );
};