import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/send-money`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    // 🔥 check if backend failed
    if (!res.ok) {
      const text = await res.text();
      console.error("Backend Error:", text);

      return NextResponse.json(
        { message: "Backend failed" },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error("Send Money API Error:", error);

    return NextResponse.json(
      { message: "Error sending money" },
      { status: 500 }
    );
  }
}