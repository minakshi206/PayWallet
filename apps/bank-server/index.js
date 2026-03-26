const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomUUID } = require("crypto");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transactions = {};

app.post("/api/transaction", (req, res) => {
  const { user_identifier, amount, webhookUrl } = req.body;

  if (!user_identifier || !amount || !webhookUrl) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const token = randomUUID();

  transactions[token] = {
    token,
    user_identifier,
    amount,
    webhookUrl,
    status: "PENDING"
  };

  return res.json({
    token,
    redirectUrl: `${process.env.FRONTEND_URL}/pay?token=${token}`, // ✅ FIXED
  });
});

app.get("/transaction/:token", (req, res) => {
  const txn = transactions[req.params.token];
  if (!txn) return res.status(404).json({ message: "Invalid token" });

  res.json(txn);
});

app.post("/pay/success", async (req, res) => {
  const { token } = req.body;
  const txn = transactions[token];

  if (!txn) return res.status(404).json({ message: "Invalid token" });

  console.log("Sending webhook to:", txn.webhookUrl);

  await fetch(txn.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: txn.token,
      user_identifier: txn.user_identifier,
      amount: txn.amount,
    })
  });

  txn.status = "SUCCESS";

  res.json({ message: "Webhook sent successfully" });
});

app.listen(3002, () => {
  console.log("Bank Server running");
});