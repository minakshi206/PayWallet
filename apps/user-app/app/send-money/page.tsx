"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue,useSetRecoilState } from "recoil";
import { userState } from "../../recoil/atom";
import "./sendmoney.css";

import toast from "react-hot-toast";

export default function SendMoneyPage() {

const router = useRouter();
const user = useRecoilValue(userState);
const setUser = useSetRecoilState(userState);

const [receiverEmail, setReceiverEmail] = useState("");
const [amount, setAmount] = useState("");
const [loading, setLoading] = useState(false);
const handleSend = async () => {
  if (!receiverEmail || !amount) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/api/send-money", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: user?.id,
        receiverEmail,
        amount: Number(amount),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      setLoading(false);
      return;
    }

    // ✅ success toast
    toast.success(data.message);

    // update recoil balance
    setUser((prev: any) => ({
      ...prev,
      balance: prev.balance - Number(amount),
    }));

    // redirect to dashboard (with delay so toast visible)
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);

  } catch (error) {
    console.error("Send error:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

return (

<div className="send-container">

  <div className="send-header">

    <div className="send-icon">
      ▶
    </div>

    <h1>Send Money</h1>
    <p>Transfer money to any account</p>

  </div>

  <div className="balance-card">

    <span>Available Balance</span>

    <h2>₹{user?.balance}</h2>

  </div>

  <div className="send-card">

    <input
      type="email"
      placeholder="Recipient Email"
      value={receiverEmail}
      onChange={(e) => setReceiverEmail(e.target.value)}
    />

    <input
      type="number"
      placeholder="₹ 0"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />

   <button onClick={handleSend} disabled={loading}>
  {loading ? "Processing..." : "Send Money"}
</button>

  </div>

</div>

);
}