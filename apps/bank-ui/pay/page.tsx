"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TransactionData {
  amount: number;
  user_identifier: string;
  webhookUrl: string;
}

export default function PayPage() {
  // If you don’t need the token from URL, just skip it
 const [token, setToken] = useState<string | null>(null);

  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);
  // 🔹 Fetch transaction details only if token exists
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchInfo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BANK_URL}/transaction/${token}`
        );
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load transaction");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [token]);

  // ✅ SUCCESS PAYMENT
  const paySuccess = async () => {
    if (!token) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BANK_URL}/pay/success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      toast.success("Payment successful!");
      toast.success("Redirecting...");

      setTimeout(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;
      }, 2000);
    } catch (error) {
      toast.error("Payment failed!");
    }
  };

  // ❌ FAILED PAYMENT
  const payFail = () => {
    toast.error("Payment cancelled");

    setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;
    }, 1500);
  };

  // ⏳ Loading UI
  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loader}></div>
        <p>Processing Payment...</p>
      </div>
    );
  }

  // ❌ Invalid token
  if (!data) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2 style={{ color: "red" }}>Invalid Transaction</h2>
          <p>Something went wrong</p>
        </div>
      </div>
    );
  }

  // ✅ MAIN UI
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h2 style={styles.title}>🏦 Secure Bank Payment</h2>

          <div style={styles.amount}>₹{data.amount / 100}</div>

          <p style={styles.subtitle}>
            Complete your payment securely
          </p>

          <button style={styles.successBtn} onClick={paySuccess}>
            Pay Now
          </button>

          <button style={styles.failBtn} onClick={payFail}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 STYLES (unchanged)
const styles: any = {
  container: {
    height: "100vh",
    backgroundImage: "url('/bankingg(1).jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  overlay: {
    width: "100%",
    height: "100%",
    backdropFilter: "blur(6px)",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "350px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "15px",
  },
  amount: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#2563eb",
    margin: "15px 0",
  },
  subtitle: {
    color: "#666",
    marginBottom: "20px",
  },
  successBtn: {
    width: "100%",
    padding: "12px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  failBtn: {
    width: "100%",
    padding: "12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};