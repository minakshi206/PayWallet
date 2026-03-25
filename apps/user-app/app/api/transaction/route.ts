import { NextResponse } from "next/server";
import { prisma } from "../../../prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }, // ✅ IMPORTANT FIX
        ],
        status: "success",
      },
      orderBy: {
        timestamp: "desc", // ✅ latest first
      },
    });

    return NextResponse.json({
      transactions
    });

  } catch (error) {
    console.error("Transactions API Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}