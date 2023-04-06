const express = require("express");
const cors = require("cors");
const crypto = require("./utils/crypto");

const app = express();
const port = 3042;

app.use(express.json());
app.use(cors());

const balances = new Map([
  ["3BAA0CCD999F60A0FD249B5E95E9A71ECE909E50", 10],
  ["9F6E927523CDE8227EEF35169AF594548A933660", 20],
  ["8E536A0E798D922DDA101F44500AC93F2282356A", 30],
]);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances.get(address) || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { recipient, amount } = message;

  const puk = crypto.signatureToPubKey(message, signature);
  const sender = crypto.getAddressFromPublicKey(puk);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances.get(sender) < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances.set(sender, balances.get(sender) - amount);
    balances.set(recipient, balances.get(recipient) + amount);
    res.send({ balance: balances.get(sender) });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances.get(address)) {
    balances.set(address, 0);
  }
}
