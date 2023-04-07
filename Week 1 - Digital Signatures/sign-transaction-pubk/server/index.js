const express = require("express");
const cors = require("cors");
const crypto = require("./utils/crypto");

const app = express();
const port = 3042;

app.use(express.json());
app.use(cors());

const accounts = new Map();

app.post("/register", (req, res) => {
  const { userName, address, balance } = req.body.params;

  accounts.set(address, { userName, balance });
  res.send({ address, balance });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;

  const account = accounts.get(address) || 0;
  const balance = account.balance || 0;

  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { recipient, amount } = message;

  const puk = crypto.signatureToPubKey(message, signature);
  const sender = crypto.getAddressFromPublicKey(puk);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const senderAccount = accounts.get(sender);
  const recipientAccount = accounts.get(recipient);

  const senderParams = {
    userName: senderAccount.userName,
    balance: senderAccount.balance - amount,
  };

  const recipientParams = {
    userName: recipientAccount ? recipientAccount.userName : recipient,
    balance: recipientAccount ? recipientAccount.balance + amount : amount,
  };

  if (accounts.get(sender).balance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    accounts.set(sender, senderParams);
    accounts.set(recipient, recipientParams);

    res.send({ balance: accounts.get(sender).balance });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  const account = accounts.get(address);

  if (!account) {
    const params = {
      userName: account.userName,
      balance: 0,
    };

    accounts.set(address, params);
  }
}
