import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Navbar from "./components/Navbar.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import CategoryNewsSummary from "./pages/CategoryNewsSummary.tsx";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/category-news-summary"
          element={<CategoryNewsSummary />}
        />
      </Routes>
    </>
  );
};

export default App;
