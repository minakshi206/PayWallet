export async function POST(req: Request) {
  const { message, history } = await req.json();

 const msg = message.toLowerCase();

const lastUserMessage = history?.[history.length - 1]?.content || "";

let reply = "";

// 💰 BALANCE
if (msg.includes("balance")) {
  reply = lastUserMessage.includes("balance")
    ? "💰 You just asked about balance 😊 You can check it on your dashboard."
    : "💰 You can check your latest balance on dashboard.";
}

// ➕ ADD MONEY
else if (msg.includes("add") || msg.includes("deposit")) {
  reply = "➕ To add money:\n1. Go to Add Money\n2. Enter amount\n3. Confirm payment 💳";
}

// 📤 SEND MONEY
else if (msg.includes("send") || msg.includes("transfer")) {
  reply = "📤 To send money:\n1. Open Send Money\n2. Enter details\n3. Confirm transfer";
}

// ⚠️ FAILED
else if (msg.includes("fail") || msg.includes("error")) {
  reply = "⚠️ Payment failed?\n✔ Check balance\n✔ Retry after few minutes\n✔ Check internet";
}

// 🔁 REFUND
else if (msg.includes("refund")) {
  reply = "🔁 Refund takes 2–5 working days depending on your bank.";
}

// 📜 HISTORY
else if (msg.includes("history")) {
  reply = "📜 You can see all transactions in History section.";
}

// 🤖 DEFAULT
else {
  reply =
    "🤖 I can help with:\n• Balance 💰\n• Send Money 📤\n• Refund 🔁\nTry asking something like: 'Check my balance'";
}

return Response.json({ reply });}