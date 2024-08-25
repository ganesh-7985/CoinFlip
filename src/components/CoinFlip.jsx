import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppProvider';

const CoinFlip = () => {
  const {
    flipCoin,
    betAmount,
    setBetAmount,
    isHeads,
    setIsHeads,
    message,
    walletAddress,
    getPlayerBalance,
    getProfit,
    collectFunds,
  } = useContext(AppContext);

  const [playerBalance, setPlayerBalance] = useState('0');
  const [profit, setProfit] = useState('0');

  useEffect(() => {
    const fetchBalanceAndProfit = async () => {
      const balance = await getPlayerBalance();
      const profitAmount = await getProfit();
      setPlayerBalance(balance);
      setProfit(profitAmount);
    };

    fetchBalanceAndProfit();
  }, [getPlayerBalance, getProfit]);

  return (
    <div className="w-full max-w-lg p-8 blue-glassmorphism rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-500 animate-slide-in">
      <h2 className="text-3xl font-semibold text-white mb-6">Hi, {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</h2>
      <p className="text-white mb-4">Ready to make some money? Enter the amount to bet and pick your side! Good luck!</p>
      <p className="text-white mb-4">
        Note: The result might take up to a few minutes. Just go grab a coffee and relax, you will get notified once the flip is over.
      </p>
      <p className="text-white mb-4">Account balance: Ξ {playerBalance}</p>
      <p className="text-white mb-4">
        Your profit: Ξ {profit}{' '}
        {profit !== '0' && (
          <button
            className="text-blue-500 hover:underline"
            onClick={collectFunds} // Attach the collectFunds handler
          >
            Collect
          </button>
        )}
      </p>
      <input
        type="number"
        placeholder="Bet Amount (ETH)"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        className="w-full p-3 mb-6 bg-white/10 border border-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-300 transition-all duration-500"
      />
      <div className="flex justify-around mb-6">
        <button
          className={`p-3 w-28 text-white font-bold rounded-lg transition-transform transform hover:scale-110 duration-300 ${
            isHeads ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          onClick={() => setIsHeads(true)}
        >
          Heads
        </button>
        <button
          className={`p-3 w-28 text-white font-bold rounded-lg transition-transform transform hover:scale-110 duration-300 ${
            !isHeads ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          onClick={() => setIsHeads(false)}
        >
          Tails
        </button>
      </div>
      <button
        className="w-full bg-purple-700 hover:bg-purple-800 text-white p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-110 duration-300 animate-float"
        onClick={flipCoin}
      >
        Flip Coin
      </button>
      {message && (
        <p className="mt-6 text-center text-sm text-gray-200 animate-fade-in">{message}</p>
      )}
    </div>
  );
};

export default CoinFlip;
