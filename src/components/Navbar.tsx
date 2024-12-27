import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.tsx";

const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Newsly
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/" sx={{ mx: 1 }}>
            Dashboard
          </Button>
          {!isLoggedIn && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ mx: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                sx={{ mx: 1 }}
              >
                Register
              </Button>
            </>
          )}
          {isLoggedIn && (
            <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
