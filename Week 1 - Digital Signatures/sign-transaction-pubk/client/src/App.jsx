import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Generator from "./Generator";
import wallet from "./utils/wallet";

import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState("");
  const [accounts, setAccounts] = useState(wallet.ACCOUNTS);

  return (
    <div className="app">
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
      />
      <Transfer setBalance={setBalance} user={user} />
    </div>
  );
}

export default App;
