import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    const bankRes = await fetch(
      `${process.env.NEXT_PUBLIC_BANK_URL}/api/transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_identifier: userId,
          amount: Number(amount) * 100,
         webhookUrl: `https://webhook-e518.onrender.com/hdfcWebhook`,
        }),
      }
    );

    // ✅ Handle bank error
    if (!bankRes.ok) {
      const text = await bankRes.text();
      console.error("Bank API Error:", text);
      return NextResponse.json(
        { message: "Bank server error" },
        { status: 500 }
      );
    }

    const data = await bankRes.json();

    // ✅ Validate response
    if (!data.token) {
      return NextResponse.json(
        { message: "Invalid bank response" },
        { status: 500 }
      );
    }

    await prisma.transaction.create({
      data: {
        amount: Number(amount),
        token: data.token,
        status: "pending",
        sender: { connect: { id: userId } },
        receiver: { connect: { id: userId } },
      },
    });

    return NextResponse.json({
      redirectUrl: data.redirectUrl,
    });

  } catch (error) {
    console.error("Add Money API Error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}