import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { AuthContext } from "../../../context/AuthContext";

describe("Navbar Component", () => {
  test("shows Login and Register when user is not logged in", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{ isLoggedIn: false, login: vi.fn(), logout: vi.fn() }}
        >
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test("shows Logout button when user is logged in", () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{ isLoggedIn: true, login: vi.fn(), logout: vi.fn() }}
        >
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test("calls logout function when Logout button is clicked", () => {
    const mockLogout = vi.fn();

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{ isLoggedIn: true, login: vi.fn(), logout: mockLogout }}
        >
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});
