const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomUUID } = require("crypto");
const fetch = require("node-fetch");  // ⭐ Needed for Node.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory temporary DB
const transactions = {};

// 1️⃣ Create transaction
app.post("/api/transaction", (req, res) => {
  const { user_identifier, amount, webhookUrl } = req.body;

  if (!user_identifier || !amount || !webhookUrl) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const token = randomUUID();
  console.log("New Bank Txn:", token);

  transactions[token] = {
    token,
    user_identifier,
    amount,
    webhookUrl,
    status: "PENDING"
  };

  return res.json({
    token,
    redirectUrl: `http://localhost:4000/pay?token=${token}`,
  });
});

// 2️⃣ Fetch transaction by token
app.get("/transaction/:token", (req, res) => {
  const txn = transactions[req.params.token];
  if (!txn) return res.status(404).json({ message: "Invalid token" });

  res.json(txn);
});

// 3️⃣ SUCCESS endpoint
app.post("/pay/success", async (req, res) => {
  const { token } = req.body;
  const txn = transactions[token];

  if (!txn) {
    return res.status(404).json({ message: "Invalid token" });
  }

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

// 4️⃣ FAIL endpoint
app.post("/pay/fail", (req, res) => {
  const { token } = req.body;
  const txn = transactions[token];

  if (!txn) {
    return res.status(404).json({ message: "Invalid token" });
  }

  txn.status = "FAILED";

  res.json({ message: "Payment failed" });
});

app.listen(3002, () => {
  console.log("Dummy Bank Server running at http://localhost:3002");
});
