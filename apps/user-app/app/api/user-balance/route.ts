import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    return NextResponse.json({
      balance: user?.balance ?? 0,
    });
  } catch (err) {
    console.error("user-balance error", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
