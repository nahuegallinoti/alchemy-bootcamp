import server from "./server";
import wallet from "./utils/wallet";

function Wallet({ user, setUser, balance, setBalance }) {
  async function onSelectUser(evt) {
    const userName = evt.target.value;

    setUser(userName);

    try {
      const address = wallet.ACCOUNTS.find((x) => {
        return x.userName === userName;
      }).address;

      const balance = await server.get(`balance/${address}`);
      setBalance(balance.data.balance);
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <div className="container wallet">
      <h1>Wallet</h1>

      <div>
        <label className="address">
          <span>Wallet Address</span>
          <select onChange={onSelectUser} value={user}>
            <option value="" disabled>
              --- Choose an user wallet ---
            </option>
            {wallet.ACCOUNTS.map((account, i) => (
              // se muestra en el desplegable el nombre del usuario
              // y se guarda en el estado el address
              <option key={i} value={account.userName}>
                {account.userName}
              </option>
            ))}
          </select>
        </label>
      </div>
      {user && (
        <>
          <div className="balance">
            Address:
            {
              wallet.ACCOUNTS.find((x) => {
                return x.userName === user;
              }).address
            }
          </div>
          <div className="balance">Balance: {balance}</div>
        </>
      )}
    </div>
  );
}

export default Wallet;
