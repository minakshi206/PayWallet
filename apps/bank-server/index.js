const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomUUID } = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transactions = {};

// ✅ CREATE TRANSACTION
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
    status: "PENDING",
  };

  return res.json({
    token,
    redirectUrl: `${process.env.NEXT_PUBLIC_BANK_URL}/pay?token=${token}`,
  });
});

// ✅ GET TRANSACTION
app.get("/transaction/:token", (req, res) => {
  const txn = transactions[req.params.token];

  if (!txn) {
    return res.status(404).json({ message: "Invalid token" });
  }

  res.json(txn);
});

// ✅ SUCCESS PAYMENT
app.post("/pay/success", async (req, res) => {
  const { token } = req.body;

  const txn = transactions[token];
  if (!txn) {
    return res.status(404).json({ message: "Invalid token" });
  }

  console.log("Sending webhook:", txn.webhookUrl);

  // 🔥 call webhook
  await fetch(txn.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: txn.token,
      user_identifier: txn.user_identifier,
      amount: txn.amount,
    }),
  });

  txn.status = "SUCCESS";

  res.json({ message: "Payment success" });
});

// ❌ FAIL PAYMENT
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
  console.log("Bank server running");
});