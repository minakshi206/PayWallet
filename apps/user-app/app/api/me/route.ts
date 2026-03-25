import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
const { userId } = await req.json();

if (!userId) {
return NextResponse.json({ error: "User ID required" }, { status: 400 });
}

const user = await prisma.user.findUnique({
where: { id: userId },
include: {
sentTransactions: true
}
});

if (!user) {
return NextResponse.json({ error: "User not found" }, { status: 404 });
}

const moneySent = user.sentTransactions.reduce(
(sum, tx) => sum + tx.amount,
0
);

return NextResponse.json({
user: {
id: user.id,
name: user.name,
balance: user.balance,
moneyAdded: user.balance,
moneySent: moneySent,
transactions: user.sentTransactions
}
});
}
