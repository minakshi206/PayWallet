import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve("../../.env")
});

import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());

app.post("/hdfcWebhook", async (req, res) => {

  const { token, user_identifier, amount } = req.body;

  console.log("TOKEN:", token);
  console.log("USER:", user_identifier);
  console.log("AMOUNT:", amount);

  try {

    const user = await prisma.user.findUnique({
      where: { id: user_identifier }
    });

    console.log("User found:", user);

    const rupees = amount / 100;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user_identifier },
        data: {
          balance: {
            increment: rupees
          }
        }
      }),

      prisma.transaction.update({
        where: { token: token },
        data: { status: "success" }
      })
    ]);

    console.log("Balance updated");

    res.json({ message: "Webhook processed successfully" });

  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ message: "Internal error" });
  }

});

app.post("/send-money", async (req, res) => {
  const { senderId, receiverEmail, amount } = req.body;

  const amt = Number(amount);

  try {
    // ✅ find sender
    const sender = await prisma.user.findUnique({
      where: { id: senderId }
    });

    // ✅ find receiver by email
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail }
    });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.balance < amt) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amt } }
      }),
      prisma.user.update({
        where: { id: receiver.id },
        data: { balance: { increment: amt } }
      }),
      prisma.transaction.create({
        data: {
          amount: amt,
          senderId: senderId,
          receiverId: receiver.id,
          status: "success"
        }
      })
    ]);

    res.json({ message: "Money sent successfully" });
    } catch (err) {
  console.error("SEND MONEY ERROR:", err);
  res.status(500).json({ message: err.message || "Transaction failed" });
}
});
/* ✅ SERVER START MUST BE OUTSIDE ROUTE */
app.listen(3003, () => {
  console.log("Webhook handler running on port 3003");
});