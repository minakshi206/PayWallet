import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        { message: "User ID and amount are required" },
        { status: 400 }
      );
    }

    // Call dummy bank server
    const bankRes = await fetch("http://localhost:3002/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_identifier: userId,
        amount: Number(amount) * 100,
        webhookUrl: "http://localhost:3003/hdfcWebhook",
      }),
    });

    const data = await bankRes.json();

    console.log("Bank response:", data);

    const token = data.token;

    // Save transaction
    await prisma.transaction.create({
      data: {
        amount: Number(amount),
        token: token,
        status: "pending",

        sender: {
          connect: { id: userId },
        },

        receiver: {
          connect: { id: userId },
        },
      },
    });

    // IMPORTANT: ALWAYS RETURN RESPONSE
    return NextResponse.json({
      redirectUrl: data.redirectUrl,
      token: token,
    });

  } catch (error) {
    console.error("Add Money API Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}