import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { registerUser, RegisterPayload } from "../api/authApi.ts";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Properly typed mutation
  const mutation: UseMutationResult<string, Error, RegisterPayload, unknown> =
    useMutation({
      mutationFn: registerUser,
      onSuccess: () => {
        navigate("/login"); // Redirect to Login
      },
      onError: () => {
        setError("Registration failed. Please try again.");
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    mutation.mutate({ name, email, password }); // Pass correct payload
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", p: 3 }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Register
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        label="Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={mutation.status === "pending"} // Use "pending" to check loading state
      >
        {mutation.status === "pending" ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Register"
        )}
      </Button>
    </Box>
  );
};

export default RegisterForm;
