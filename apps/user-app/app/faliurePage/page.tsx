"use client";

import { useRouter } from "next/navigation";

export default function FailedPage() {
  const router = useRouter();

  return (
    <div className="result fail">
      <div className="card">
        <h1>❌ Payment Failed</h1>
        <p>Something went wrong</p>

        <button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}