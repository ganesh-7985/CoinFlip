import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppProvider';
import { ethers } from 'ethers';

const TransactionHistory = () => {
  const { contract, walletAddress } = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!contract || !walletAddress) return;

      try {
        // Assuming your contract has a method to get user transactions
        const txs = await contract.getUserTransactions(walletAddress);
        
        const formattedTxs = await Promise.all(txs.map(async (tx) => ({
          txHash: tx.transactionHash,
          amount: ethers.utils.formatEther(tx.amount),
          isWin: tx.isWin,
          timestamp: new Date(tx.timestamp * 1000).toLocaleString(),
        })));

        setTransactions(formattedTxs);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [contract, walletAddress]);

  return (
    <div className="p-6 white-glassmorphism rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      {Array.isArray(transactions) && transactions.length > 0 ? (
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li key={tx.txHash} className="bg-gray-800 p-3 rounded hover:bg-gray-700 transition-all duration-300">
              <p className="text-sm text-gray-300">
                {tx.isWin ? 'Won' : 'Lost'} Ξ{tx.amount} 
                <span className="ml-2 text-xs text-gray-400">({tx.timestamp})</span>
              </p>
              <a 
                href={`https://etherscan.io/tx/${tx.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline"
              >
                View on Etherscan
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionHistory;