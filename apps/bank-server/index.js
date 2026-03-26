const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomUUID } = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transactions = {};

app.post("/api/transaction", (req, res) => {
  const { user_identifier, amount, webhookUrl } = req.body;

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
    redirectUrl: `${process.env.FRONTEND_URL}/pay?token=${token}`,
  });
});

app.listen(3002, () => {
  console.log("Bank server running");
});