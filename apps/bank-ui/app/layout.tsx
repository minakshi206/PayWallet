import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Toaster position="top-right" toastOptions={{
    style: {
      fontSize: "17px",
      padding: "18px 24px",
      borderRadius: "14px",
      minWidth: "320px",
      background: "#1e293b",
      color: "#fff",
      fontWeight: "500",
    },
  }} reverseOrder={false} />
        {children}   {/* ✅ ONLY THIS */}
      </body>
    </html>
  );
}