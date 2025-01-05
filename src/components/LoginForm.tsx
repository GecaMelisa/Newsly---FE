import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";

import { loginUser, LoginPayload } from "../api/authApi.ts";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.tsx";

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext); // Use login function from AuthContext
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Mutation for logging in
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (token) => {
      localStorage.setItem("token", token.split(" ")[1]); // Save token in localStorage
      login(); // Update AuthContext to reflect login state
      navigate("/"); // Redirect to dashboard
    },
    onError: () => {
      setError("Invalid email or password. Please try again.");
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    mutation.mutate({ email, password }); // Trigger mutation
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", p: 3 }}
    >
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Login
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={mutation.status === "pending"} // Disable button while loading
      >
        {mutation.status === "pending" ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Login"
        )}
      </Button>
    </Box>
  );
};

export default LoginForm;
