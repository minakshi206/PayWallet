"use client";

import { useRouter } from "next/navigation";
import "./result.css";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="result success">
      <div className="card">
        <h1>✅ Payment Successful</h1>
        <p>Your money has been added successfully</p>

        <button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}