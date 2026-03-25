"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Card,
  CardContent
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { signupService } from "../../services/authService";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleSignup = async () => {

    if(!name || !email || !password){
      alert("Please fill all fields");
      return;
    }

    try{

      await signupService(name,email,password);

      alert("Signup successful! Redirecting to login...");
setTimeout(() => {
  router.push("/");
}, 1500);

    }catch(err){

      console.error(err);
      alert("Signup failed");

    }

  };

  return (

    <div
      style={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#eef2f7"
      }}
    >

      <Card sx={{width:420,borderRadius:4,overflow:"hidden"}}>

        {/* TOP BLUE SECTION */}

        <div
          style={{
            background:"#1f3b63",
            color:"white",
            textAlign:"center",
            padding:"40px"
          }}
        >

          <AccountBalanceWalletIcon sx={{fontSize:50,mb:1}}/>

          <h2>Create Account</h2>

          <p style={{opacity:0.8}}>
            Join PaytmClone and start transacting
          </p>

        </div>

        <CardContent sx={{p:4}}>

          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <PersonIcon/>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <EmailIcon/>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <LockIcon/>
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt:3,
              background:"#1f3b63",
              padding:"12px",
              borderRadius:"25px",
              fontSize:"16px"
            }}
            onClick={handleSignup}
          >
            Sign Up
          </Button>

        </CardContent>

      </Card>

    </div>
  );
}