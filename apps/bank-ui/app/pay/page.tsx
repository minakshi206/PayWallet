"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface TransactionData {
  amount: number;
  user_identifier: string;
  webhookUrl: string;
}

export default function PayPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchInfo = async () => {
      try {
        const res = await fetch(`http://localhost:3002/transaction/${token}`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [token]);

 const paySuccess = async () => {
  if (!token) return;

  try {
    await fetch("http://localhost:3002/pay/success", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    toast.success("Payment successful!");
    toast.success("Your money is being transferred...");
    toast.success("Redirecting to dashboard...");

    setTimeout(() => {
      window.location.href = "http://localhost:3001/dashboard";
    }, 2500);

  } catch (error) {
    toast.error("Payment error!");
  }
};

const payFail = () => {
  toast.error("Payment failed!");

  setTimeout(() => {
    window.location.href = "http://localhost:3001/dashboard";
  }, 1500);
};

  // ✅ LOADING UI
  if (loading)
    return (
      <div style={styles.center}>
        <div style={styles.loader}></div>
        <p>Processing Payment...</p>
      </div>
    );

  // ❌ INVALID TOKEN UI
  if (!data)
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2 style={{ color: "red" }}>Invalid Transaction</h2>
          <p>Something went wrong</p>
        </div>
      </div>
    );

  // ✅ MAIN UI
  return (
    <div style={styles.container}>
     {/* BLUR BACKGROUND */}
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
    
  );
}

/* 🎨 INLINE STYLES (NO CSS FILE NEEDED) */
const styles: any = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
   backgroundImage: "url('/bankingg(1).jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
    padding: "10px",
  },
  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#c2bcbc",
    padding: "30px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "350px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
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
  overlay: {
  width: "100%",
  height: "100%",
  backdropFilter: "blur(6px)",
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},
};