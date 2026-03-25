"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import {
  AccountBalanceWallet,
  Security,
  Speed,
  ReceiptLong,
  ArrowForward,
  PlayCircle,
} from "@mui/icons-material";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Security sx={{ fontSize: 40, color: "#2563eb" }} />,
    title: "Secure Payments",
    description: "Bank-grade security with end-to-end encryption",
  },
  {
    icon: <Speed sx={{ fontSize: 40, color: "#2563eb" }} />,
    title: "Fast Transfers",
    description: "Instant transfers to any bank or mobile number",
  },
  {
    icon: <ReceiptLong sx={{ fontSize: 40, color: "#2563eb" }} />,
    title: "Transaction Tracking",
    description: "Complete history of all your transactions",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: "#f8fafc" }}>
      {/* ================= HERO ================= */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
          color: "white",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Typography variant="h3" fontWeight={800}>
                  Welcome to <br /> PayWallet Dashboard
                </Typography>

                <Typography sx={{ mt: 2, opacity: 0.85 }}>
                  Experience seamless digital payments. Add money, send money,
                  and track transactions in one place.
                </Typography>
              </motion.div>
            </Grid>

            {/* ✅ FIXED PART */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  height: "100%",
                }}
              >
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Box
                    sx={{
                      width: 320,
                      borderRadius: 4,
                      p: 5,
                      background:
                        "linear-gradient(135deg, #1e3a8a, #c2410c)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 25px 70px rgba(0,0,0,0.45)",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Ready to get started?
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "rgba(255,255,255,0.75)" }}
                    >
                      Send money, track payments & manage wallet instantly.
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        mt: 3,
                        bgcolor: "white",
                        color: "primary.main",
                        fontWeight: 600,
                        borderRadius: 99,
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                        },
                      }}
                      onClick={() => router.push("/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= VIDEO ================= */}
      <Box sx={{ py: 8, bgcolor: "grey.100" }}>
        <Container>
          <Typography variant="h4" fontWeight={700} align="center" mb={4}>
            Project Live Demo
          </Typography>

          <Box
            sx={{
              maxWidth: 900,
              mx: "auto",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 4,
            }}
          >
            <video
              src="/videos/paytm-demo.mp4"
              controls
              autoPlay
              muted
              loop
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Container>
      </Box>

      {/* ================= FEATURES ================= */}
      <Box sx={{ py: 10 }}>
        <Container>
          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Card sx={{ borderRadius: 5, height: "100%" }}>
                  <CardContent sx={{ textAlign: "center", py: 5 }}>
                    {f.icon}
                    <Typography variant="h6" mt={2} fontWeight={600}>
                      {f.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {f.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}