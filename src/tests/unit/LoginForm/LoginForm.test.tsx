import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import LoginForm from "../../../components/LoginForm";
import { AuthContext } from "../../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<any>("@tanstack/react-query");
  return {
    ...actual,
    useMutation: () => ({
      mutate: vi.fn(),
      status: "idle",
    }),
  };
});

describe("LoginForm Component", () => {
  const renderWithAuthContext = () =>
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            login: vi.fn(),
            logout: vi.fn(),
            isLoggedIn: false,
          }}
        >
          <LoginForm />
        </AuthContext.Provider>
      </BrowserRouter>
    );

  test("renders email and password input fields", () => {
    renderWithAuthContext();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates email and password on user input", () => {
    renderWithAuthContext();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("displays loading spinner when submitting", () => {
    vi.mocked(require("@tanstack/react-query").useMutation).mockReturnValue({
      mutate: vi.fn(),
      status: "pending",
    });

    renderWithAuthContext();

    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
