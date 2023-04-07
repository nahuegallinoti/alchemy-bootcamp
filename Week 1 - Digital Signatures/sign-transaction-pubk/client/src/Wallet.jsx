import server from "./server";
import { useEffect, useState } from "react";

function Wallet({ user, setUser, balance, setBalance, accounts }) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      const selectedAccount = accounts.find(
        (account) => account.userName === user
      );
      setAddress(selectedAccount.address);
    }
  }, [user, accounts]);

  async function onSelectUser(evt) {
    const userName = evt.target.value;
    setUser(userName);

    const selectedAccount = accounts.find(
      (account) => account.userName === userName
    );
    const selectedAddress = selectedAccount.address;
    setAddress(selectedAddress);

    try {
      const res = await server.get(`balance/${selectedAddress}`);
      setBalance(res.data.balance);
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <>
      {user && (
        <div className="container wallet">
          <h1>Wallet</h1>

          <div>
            <label className="chooseWallet">
              <span>Wallet Address</span>
              <select onChange={onSelectUser} value={user}>
                <option value="" disabled>
                  --- Choose a user wallet ---
                </option>
                {accounts.map((account) => (
                  <option key={account.userName} value={account.userName}>
                    {account.userName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {address && (
            <div className="addressContainer">
              <span className="addressTxt">Address</span>
              <label className="address">{address}</label>
              <span className="addressTxt">Balance</span>
              <label className="balance">{balance}</label>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Wallet;
