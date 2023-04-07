import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Generator from "./Generator";
import wallet from "./utils/wallet";
import TransactionHistory from "./TransactionHistory";

import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState("");
  const [accounts, setAccounts] = useState(wallet.ACCOUNTS);
  const [transactionHistory, setTransactionHistory] = useState([]);

  return (
    <div className="app">
      <div className="generatorWallet">
        <Generator
          setAccounts={setAccounts}
          setBalance={setBalance}
          setUser={setUser}
        />
        <Wallet
          balance={balance}
          setBalance={setBalance}
          user={user}
          setUser={setUser}
          accounts={accounts}
        />
      </div>
      <div className="generatorWallet">
        <Transfer
          setBalance={setBalance}
          setTransactionHistory={setTransactionHistory}
          transactionHistory={transactionHistory}
          user={user}
          accounts={accounts}
        />
        <TransactionHistory
          transactionHistory={transactionHistory}
          setTransactionHistory={setTransactionHistory}
        />
      </div>
    </div>
  );
}

export default App;
