export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Call your deployed bank-server
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Add Money Error:", error);

    return NextResponse.json(
      { message: "Error adding money" },
      { status: 500 }
    );
  }
}