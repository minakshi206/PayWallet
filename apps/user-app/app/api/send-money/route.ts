import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendPaymentEmails } from "../../../../lib/email";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { senderId, receiverEmail, amount } = await req.json();

    if (!senderId || !receiverEmail || !amount) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const sendAmount = Number(amount);

    if (sendAmount <= 0) {
      return NextResponse.json(
        { message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Find sender
    const sender = await prisma.user.findUnique({
      where: { id: senderId }
    });

    if (!sender) {
      return NextResponse.json(
        { message: "Sender not found" },
        { status: 404 }
      );
    }

    if (sender.balance < sendAmount) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 403 }
      );
    }

    // Find receiver
    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail }
    });

    if (!receiver) {
      return NextResponse.json(
        { message: "Receiver not found" },
        { status: 404 }
      );
    }
    if (sender.email === receiverEmail) {
  return NextResponse.json(
    { message: "You cannot send money to yourself" },
    { status: 400 }
  );
}

    // Transaction (safe way)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: senderId },
        data: {
          balance: { decrement: sendAmount }
        }
      }),

      prisma.user.update({
        where: { id: receiver.id },
        data: {
          balance: { increment: sendAmount }
        }
      }),

      prisma.transaction.create({
        data: {
          amount: sendAmount,
          senderId: senderId,
          receiverId: receiver.id,
          status: "success"
        }
      })
    ]);
    console.log("Transaction completed");
    // 📧 send email notifications
await sendPaymentEmails(sender.email, receiver.email, sendAmount);

    return NextResponse.json(
      { message: "Money sent successfully" },
      { status: 200 }
      
    );

  } catch (error) {
    console.error("Send Money API Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
      
    );
  }
}