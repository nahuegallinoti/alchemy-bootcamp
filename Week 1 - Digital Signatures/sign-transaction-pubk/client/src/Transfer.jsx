import { useState } from "react";
import server from "./server";
import wallet from "./utils/wallet";

function Transfer({
  user,
  setBalance,
  setTransactionHistory,
  transactionHistory,
  accounts,
}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      amount: parseInt(sendAmount),
      recipient,
    };

    const address = accounts.find((a) => a.userName === user).address;

    const signature = await wallet.sign(address, message);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        message,
        signature,
      });

      setBalance(balance);

      const transaction = {
        id: transactionHistory.length + 1,
        from: address,
        to: recipient,
        amount: sendAmount,
      };

      setTransactionHistory((prev) => [transaction, ...prev]);

      setRecipient("");
      setSendAmount("");
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Transfer</h1>

      <label className="recipient">
        Recipient
        <input
          placeholder="Type recipient address here"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label className="amount">
        Amount
        <input
          placeholder="10"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <div>
        <input type="submit" className="button" value="Transfer" />
      </div>
    </form>
  );
}

export default Transfer;
