"use client";

import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atom";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function TransactionsPage() {
  const user = useRecoilValue(userState);
  const [transactions, setTransactions] = useState([]);

 useEffect(() => {
  if (!user) return;

  const fetchTx = async () => {
    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      const formatted = data.transactions.map((t: any) => ({
        type:
          t.senderId === user.id
            ? "send"
            : t.receiverId === user.id
            ? "add"
            : "unknown",

        amount: t.amount,
        date: t.timestamp,

        recipient:
          t.senderId === user.id
            ? t.receiverId
            : t.senderId,

        status: "Success",
      }));

      setTransactions(formatted);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load transactions");
    }
  };

  fetchTx();
}, [user]);
  return (
    <div className="min-h-screen bg-[#eef2f7] p-6">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-5 px-6 py-4 bg-gray-100 font-semibold text-gray-700">
          <p>Type</p>
          <p>Amount</p>
          <p>Date & Time</p>
          <p>Recipient</p>
          <p>Status</p>
        </div>

        {/* ROWS */}
        {transactions.map((tx: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-5 px-6 py-5 items-center border-t hover:bg-gray-50 transition"
          >

            {/* TYPE */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  tx.type === "add"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {tx.type === "add" ? "↓" : "↑"}
              </div>

              <p className="font-medium">
                {tx.type === "add" ? "Money Added" : "Money Sent"}
              </p>
            </div>

            {/* AMOUNT */}
            <p
              className={`font-semibold ${
                tx.type === "add" ? "text-green-600" : "text-black"
              }`}
            >
              {tx.type === "add" ? "+" : "-"}₹{tx.amount}
            </p>

            {/* DATE */}
            <div>
              <p>
                {new Date(tx.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(tx.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* RECIPIENT */}
            <p>{tx.recipient}</p>

            {/* STATUS */}
            <div>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                ✓ Success
              </span>
            </div>

          </div>
        ))}

        {/* EMPTY STATE */}
        {transactions.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No transactions yet
          </p>
        )}

      </div>

     <div className="table-footer">

  <p>
    Showing {transactions.length} transactions
  </p>

  <Link href="/dashboard" className="back-btn">
    ← Back to Dashboard
  </Link>

</div>

    </div>
  );
}