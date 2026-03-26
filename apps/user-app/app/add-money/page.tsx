"use client";

import { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../recoil/atom";
import axios from "axios";
import styles from "./AddMoney.module.css";
import toast from "react-hot-toast";

const quickAmounts = [500, 1000, 2000, 5000];

export default function AddMoney() {
  const user = useRecoilValue(userState);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const fetchUser = async () => {
      const saved = localStorage.getItem("user");
      if (!saved) return;

      const parsed = JSON.parse(saved);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
        { userId: parsed.id }
      );

      const updatedUser = {
        ...parsed,
        balance: res.data.user.balance,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    fetchUser();
  }, []);

  const handleAdd = async () => {
    if (!user?.id) {
      toast.error("User not loaded");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/add-money`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      if (data.redirectUrl) {
        toast.success("Redirecting to secure bank...");
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 1000);
      } else {
        toast.error("Payment initialization failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>Add Money</h1>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />

      <button onClick={handleAdd}>
        {loading ? "Processing..." : "Add Money"}
      </button>
    </div>
  );
}