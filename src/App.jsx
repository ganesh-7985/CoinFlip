import React from 'react';
import CoinFlip from './components/CoinFlip';
import ConnectWalletButton from './components/ConnectWalletButton';
import TransactionHistory from './components/TransactionHistory';

const App = () => {
  return (
    <div className="min-h-screen p-8 gradient-bg-welcome  text-white">
      <h1 className="text-5xl font-bold mb-8 text-center animate-pulse">FLIP THE COIN</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col items-center">
          <CoinFlip />
        </div>
        <div className="flex flex-col items-center mt-24 ">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1024px-MetaMask_Fox.svg.png" alt="MetaMask" className="w-32 mb-6 animate-bounce" />
          <ConnectWalletButton />
        </div>
      
      </div>
      <div className="mt-12">
        <TransactionHistory />
      </div>
    </div>
  );
};

export default App;




