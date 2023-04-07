import server from "./server";
import wallet from "./utils/wallet";
import { useState } from "react";

function Generator({ setAccounts, setBalance, setUser }) {
  const [userName, setUserName] = useState("");
  const [initialAmount, setInitialAmount] = useState(0);

  const generateAddress = async (evt) => {
    evt.preventDefault();

    try {
      if (userName) {
        const user = wallet.getAddress(userName);

        if (user)
          throw new Error("User already exists. Please choose another name.");

        wallet.generateWallet(userName);

        const address = wallet.ACCOUNTS.at(-1).address;

        const balance = parseInt(initialAmount);

        const params = {
          userName,
          address,
          balance,
        };

        await server.post("register", {
          params,
        });

        setAccounts([...wallet.ACCOUNTS]);
        setBalance(balance);
        setUser(userName);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const setValue = (setter) => (evt) => setter(evt.target.value);

  return (
    <form className="container transfer" onSubmit={generateAddress}>
      <h1>Generate Address</h1>

      <label className="account">
        Name
        <input
          placeholder="Type name here"
          value={userName}
          onChange={setValue(setUserName)}
        ></input>
      </label>

      <label className="amount">
        Amount
        <input
          placeholder="10"
          value={initialAmount}
          onChange={setValue(setInitialAmount)}
        ></input>
      </label>

      <input type="submit" className="button" value="Generate" />
    </form>
  );
}

export default Generator;
