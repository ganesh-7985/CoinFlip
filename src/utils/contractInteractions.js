export const getPlayerBalance = async (contract) => {
  if (!contract) {
    throw new Error('Contract is not initialized');
  }
  return await contract.getBalance();
};

export const getUserTransactions = async (contract) => {
  const transactions = await contract.getUserTransactions();
  return transactions;
};