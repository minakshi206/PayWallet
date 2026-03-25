import "./globals.css";
import type { Metadata } from "next";
import Providers from "./provider";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Paytm Clone",
  description: "Paytm clone project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayout>
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
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}