import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (token: string) => void; // Accept token for login
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Check for token in localStorage to determine initial login state
    return !!localStorage.getItem("token");
  });

  const login = (token: string) => {
    localStorage.setItem("token", token); // Save token to localStorage
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Update login state whenever the token changes in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
