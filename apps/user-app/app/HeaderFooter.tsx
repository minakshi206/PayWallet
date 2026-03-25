"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import toast from "react-hot-toast";

// import "./header.css"; // 👈 NEW CSS FILE

export default function HeaderFooter({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

 const hideHeader =
  path.startsWith("/pay") ||
  path.startsWith("/success") ||
  path.startsWith("/failed") ||
  path === "/" ||
  path === "/signup";

const handleLogout = () => {
  localStorage.clear();

  // ✅ show toast
  toast.success("Logged out successfully");

  // ✅ delay so user can see toast
  setTimeout(() => {
    router.push("/");
  }, 1200);
};

const navItems = [
  { name: "Home", href: "/home", icon: <HomeIcon fontSize="small" /> },
  { name: "Dashboard", href: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
  { name: "Add Money", href: "/add-money", icon: <AddCircleOutlineIcon fontSize="small" /> },
  { name: "Send Money", href: "/send-money", icon: <SendIcon fontSize="small" /> },
  { name: "History", href: "/transactions", icon: <HistoryIcon fontSize="small" /> },
];

  return (
    <>
      {!hideHeader && (
        <header className="header">
          
          {/* LOGO */}
          <div className="logo">
            <div className="logo-icon">💳</div>
            PayWallet
          </div>

          {/* DESKTOP NAV */}
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={path === item.href ? "active" : ""}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="right">
            
            {/* MOBILE MENU BTN */}
            <div className="mobile-menu">
              {menuOpen ? (
                <CloseIcon onClick={() => setMenuOpen(false)} />
              ) : (
                <MenuIcon onClick={() => setMenuOpen(true)} />
              )}
            </div>

            {/* PROFILE */}
            <div className="profile" onClick={() => setOpen(!open)}>
              <AccountCircleIcon fontSize="large" />

              {open && (
                <div className="dropdown">
                  <p>{user?.name || "User"}</p>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE NAV */}
          {menuOpen && (
            <div className="mobile-nav">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </header>
      )}

      <main className="main">{children}</main>

      {!hideHeader && <footer className="footer">© 2026 PayWallet • Built with ❤️</footer>}
    </>
  );
}