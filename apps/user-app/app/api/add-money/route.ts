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
          webhookUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/hdfcWebhook`,
        }),
      }
    );

    const data = await bankRes.json();

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
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}