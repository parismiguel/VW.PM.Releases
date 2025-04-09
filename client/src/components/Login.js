import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  CssBaseline,
  Paper,
  TextField,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axiosInstance from "../axiosConfig";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
  
      // Store OIDC token (if needed)
      localStorage.setItem("oidcToken", response.data.token);
  
      // Store Basic Authentication credentials for API requests
      const basicAuth = btoa(
        `${process.env.REACT_APP_BASIC_AUTH_USER}:${process.env.REACT_APP_BASIC_AUTH_PASS}`
      );
      localStorage.setItem("auth", basicAuth);
  
      // Redirect to the OIDC flow
      window.location.href = response.data.redirectUrl;
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 2, width: "100%" }}>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;