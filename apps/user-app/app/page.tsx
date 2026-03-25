"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Lock, Phone, Visibility, VisibilityOff } from "@mui/icons-material";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setError("");
  setLoading(true);

  try {
    const res = await axios.post("/api/login", {
      email,
      password,
    });

    if (res.status === 200) {
      const user = res.data.user;

      const userData = {
        id: user.id,
        name: user.name,
        balance: user.balance,
        isLoggedIn: true,
        moneyAdded: 0,
        moneySent: 0,
        transactions: [],
      };

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ TOAST SUCCESS
      toast.success("Login successful!");

      // ✅ Redirect after toast
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    }

  } catch (err: any) {
    const message =
      err.response?.data?.message || "Invalid email or password";

    setError(message);

    // ❌ REMOVE ALERT → ✅ TOAST ERROR
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: 420, borderRadius: 4, boxShadow: 8 }}>
        {/* ===== HEADER ===== */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
            color: "white",
            py: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Login to your PaytmClone account
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* EMAIL */}
          <TextField
            fullWidth
            label="Mobile Number or Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />

          {/* PASSWORD */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* LOGIN BUTTON */}
          <Button
            fullWidth
            size="large"
            sx={{
              mt: 3,
              borderRadius: 99,
              background:
                "linear-gradient(135deg, #1e3a8a, #0f172a)",
            }}
            variant="contained"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography align="center" mt={2} fontSize={14}>
            New to PaytmClone?{" "}
            <span
              style={{ color: "#2563eb", cursor: "pointer" }}
              onClick={() => router.push("/signup")}
            >
              Create Account
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
