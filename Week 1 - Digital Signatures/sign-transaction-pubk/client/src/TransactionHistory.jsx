function TransactionHistory({ transactionHistory }) {
  return (
    <div className="container transactionHistoryContainer">
      <h1>Transaction History</h1>
      {transactionHistory.map((transaction) => {
        return (
          <div className="transaction">
            <p>Id: {transaction.id}</p>
            <p>From: {transaction.from}</p>
            <p>To: {transaction.to}</p>
            <p>Amount: {transaction.amount}</p>
          </div>
        );
      })}
    </div>
  );
}

export default TransactionHistory;
