"use client";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atom";
import { useEffect, useState } from "react";
import Link from "next/link"; // Re-imported for functionality
import axios from "axios";

export default function DashboardPage() {
  const user = useRecoilValue(userState);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([
  { role: "assistant", content: "Hi 👋 I’m PayAssist. Ask me about payments." }
]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

const fetchUser = async () => {
  try {
    const saved = localStorage.getItem("user");
    if (!saved) return;

    const parsed = JSON.parse(saved);

    const res = await axios.post("/api/me", {
      userId: parsed.id,
    });

    const txRes = await axios.post("/api/transaction", {
      userId: parsed.id,
    });

    // ✅ FIX 1: ADD TYPE FIELD
    const formatted = (txRes.data.transactions || []).map((t: any) => ({
      ...t,
      type: t.senderId === parsed.id ? "send" : "add",
    }));

    setTransactions(formatted);

    // ✅ FIX 2: UPDATE BALANCE
    const updatedUser = {
      ...parsed,
      balance: res.data.user.balance,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => { fetchUser(); }, []);

  // ✅ SEND MESSAGE FUNCTION (ADD THIS)
const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { role: "user", content: input };

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setLoading(true);
  const lastMessages = messages.slice(-3); // ✅ ADD THIS

  try {
    
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  message: input,
  history: lastMessages, // ✅ ADD THIS
}),
    });

    const data = await res.json();

   setMessages((prev) => {
  const updated = [...prev];
  updated.push({ role: "assistant", content: data.reply });
  return updated;
});
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "⚠️ Error connecting AI" },
    ]);
  }

  setLoading(false);
};

  if (!user) return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;

const addedCount = transactions.filter(t => t.type === "add").length;
const sentCount = transactions.filter(t => t.type === "send").length;

  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1B2559", margin: 0 }}>Welcome back! 👋</h1>
        <p style={{ color: "#707EAE", fontSize: "13px" }}>Check your wallet status</p>
      </div>

      {/* Top Section */}
      <div className="dashboard-grid">
        <div className="card-hover balance-card" style={{
          background: "linear-gradient(135deg, #007EF4 0%, #22A1F5 100%)",
          borderRadius: "24px",
          padding: "24px",
          color: "white",
        }}>
          <p style={{ fontSize: "13px", opacity: 0.9 }}>Total Balance</p>
          <h2 style={{ fontSize: "42px", fontWeight: 800, margin: "8px 0" }}>₹{user.balance.toLocaleString()}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
            <div style={statBadge}>↙ Sent {addedCount}</div>
            <div style={statBadge}>↗ Added {sentCount}</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "24px", padding: "20px", border: "1px solid #F0F5FF" }}>
          <p style={{ color: "#707EAE", fontSize: "12px", fontWeight: 600 }}>Activity Overview</p>
          <h3 style={{ fontSize: "18px", color: "#1B2559", margin: "4px 0 16px 0" }}>{addedCount + sentCount} Transactions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <ActivityItem label="Sent" val={addedCount} color="#E6FAF5" iconColor="#05CD99" icon="↙" />
            <ActivityItem label="Added" val={sentCount} color="#EEF2FF" iconColor="#4318FF" icon="↗" />
          </div>
        </div>
      </div>

      {/* Quick Actions (Functionality Restored with Link) */}
      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2559", marginBottom: "12px" }}>Quick Actions</h3>
        <div className="actions-grid">
          <ActionTile color="#05CD99" title="Add Money" icon="+" href="/add-money" />
          <ActionTile color="#4318FF" title="Send Money" icon="↗" href="/send-money" />
          <ActionTile color="#FF5C00" title="History" icon="↺" href="/transactions" />
        </div>
      </div>

      {/* PayAssist AI */}
      <div className="chat-container">
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1B2559", marginBottom: "12px" }}>PayAssist AI</h3>
        <div style={{ background: "white", borderRadius: "24px", border: "1px solid #E0E5F2", overflow: "hidden" }}>
          <div style={chatHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={aiIcon}>🤖</div>
              <span style={{ fontWeight: 700, fontSize: "14px" }}>PayAssist AI</span>
            </div>
          </div>
        <div style={chatBox}>
  {messages.map((msg, i) => (
    <div
      key={i}
      style={{
        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
        background: msg.role === "user" ? "#4318FF" : "#F4F7FE",
        color: msg.role === "user" ? "white" : "#1B2559",
        padding: "10px 14px",
        borderRadius:
          msg.role === "user"
            ? "14px 14px 0 14px"
            : "0 14px 14px 14px",
        maxWidth: "75%",
        fontSize: "13px",
      }}
    >
      {msg.content}
    </div>
  ))}

  {loading && (
    <div style={{ fontSize: "12px", color: "#888" }}>
      AI is typing...
    </div>
  )}
</div>
          <div style={inputContainer}>
           <input
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  placeholder="Ask about payments..."
  style={chatInput}
/>
          <button onClick={sendMessage} style={sendBtn}>
  ↗
</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Internal UI Components ---

const ActivityItem = ({ label, val, color, iconColor, icon }: any) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ width: "28px", height: "28px", background: color, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, fontSize: "12px" }}>{icon}</div>
      <span style={{ color: "#707EAE", fontSize: "13px" }}>{label}</span>
    </div>
    <span style={{ fontWeight: 700, color: "#1B2559", fontSize: "14px" }}>{val}</span>
  </div>
);

// Added Link wrapping for Redirection
const ActionTile = ({ color, title, icon, href }: any) => (
  <Link href={href} style={{ textDecoration: "none" }}>
    <div className="card-hover action-card" style={{ background: color, borderRadius: "20px", padding: "20px", color: "white" }}>
      <div style={{ fontSize: "20px", marginBottom: "8px" }}>{icon}</div>
      <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>{title}</h4>
      <div style={{ fontSize: "11px", marginTop: "8px", opacity: 0.8 }}>Get Started →</div>
    </div>
  </Link>
);

// CSS objects remain the same as previous version...
const statBadge: React.CSSProperties = { background: "rgba(255,255,255,0.2)", padding: "6px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: 600 };
const chatHeader: React.CSSProperties = { padding: "12px 16px", borderBottom: "1px solid #F4F7FE", display: "flex", alignItems: "center" };
const aiIcon: React.CSSProperties = { width: "30px", height: "30px", background: "#4318FF", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px" };
const chatBox: React.CSSProperties = { height: "180px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", background: "#FCFDFF", overflowY: "auto" };
const botBubble: React.CSSProperties = { background: "#F4F7FE", padding: "10px 14px", borderRadius: "0 14px 14px 14px", fontSize: "13px", color: "#1B2559", maxWidth: "90%", border: "1px solid #E0E5F2" };
const inputContainer: React.CSSProperties = { padding: "12px", borderTop: "1px solid #F4F7FE", display: "flex", gap: "8px" };
const chatInput: React.CSSProperties = { flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #E0E5F2", background: "#F4F7FE", outline: "none", fontSize: "13px" };
const sendBtn: React.CSSProperties = { width: "40px", height: "40px", background: "#4318FF", borderRadius: "10px", border: "none", color: "white", cursor: "pointer" };