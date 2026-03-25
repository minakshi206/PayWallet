import "./dashboard.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F4F7FE",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: "20px 16px", /* Reduced padding for mobile */
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {children}
      </div>
    </div>
  );
}