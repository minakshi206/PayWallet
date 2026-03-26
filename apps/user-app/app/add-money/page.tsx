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
  `/api/me`,
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
  `/api/add-money`,
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
      // ✅ optional info toast before redirect
      toast.success("Redirecting to secure bank...");
      
      setTimeout(() => {
        window.location.href = data.redirectUrl;
      }, 1000);
    } else {
      toast.error("Payment initialization failed");
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Something went wrong");
  }

  setLoading(false);
};

  return (
    <div className={styles.container}>
      
      <div className={styles.iconBox}>
        <svg width="30" height="30" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M12 9v6M9 12h6" />
        </svg>
      </div>

      <h1 className={styles.title}>Add Money</h1>
      <p className={styles.subtitle}>Add funds to your wallet</p>

      <div className={styles.balanceWrapper}>
        <div className={styles.balanceCard}>
          <p className={styles.balanceLabel}>Current Balance</p>
          <p className={styles.balanceAmount}>
            ₹{user?.balance?.toLocaleString("en-IN") ?? 0}
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.inputBox}>
          <label className={styles.label}>Enter Amount</label>

          <div className={styles.inputRow}>
            <span>₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className={styles.quickBox}>
          {quickAmounts.map((amt) => {
            const selected = amount === String(amt);

            return (
              <button
                key={amt}
                onClick={() => setAmount(String(amt))}
                className={`${styles.quickBtn} ${
                  selected ? styles.quickSelected : ""
                }`}
              >
                ₹{amt}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleAdd}
          disabled={loading || !amount || Number(amount) <= 0}
          className={`${styles.addBtn} ${
            loading || !amount || Number(amount) <= 0 ? styles.disabled : ""
          }`}
        >
          {loading ? "Processing..." : "Add Money to Wallet"}
        </button>
      </div>

      <p className={styles.footer}>
        Money will be added instantly to your wallet
      </p>
    </div>
  );
}