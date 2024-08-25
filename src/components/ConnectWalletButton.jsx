import React, { useContext } from 'react';
import { AppContext } from '../context/AppProvider';

const ConnectWalletButton = () => {
  const { setWalletAddress } = useContext(AppContext);
  const [connected, setConnected] = React.useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error("Connection failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-48 transition-all duration-300"
      onClick={connectWallet}
    >
      {connected ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );
};

export default ConnectWalletButton;