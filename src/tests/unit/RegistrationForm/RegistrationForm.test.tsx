import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import RegistrationForm from "../../../components/RegistrationForm";
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

describe("RegistrationForm Component", () => {
  const renderWithAuth = () =>
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            login: vi.fn(),
            logout: vi.fn(),
            isLoggedIn: false,
          }}
        >
          <RegistrationForm />
        </AuthContext.Provider>
      </BrowserRouter>
    );

  test("renders name, email, password fields and register button", () => {
    renderWithAuth();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("updates input fields on user typing", () => {
    renderWithAuth();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "securepass" },
    });

    expect(screen.getByLabelText(/name/i)).toHaveValue("Test User");
    expect(screen.getByLabelText(/email/i)).toHaveValue("user@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("securepass");
  });

  test("displays spinner on submit", () => {
    vi.mocked(require("@tanstack/react-query").useMutation).mockReturnValue({
      mutate: vi.fn(),
      status: "pending",
    });

    renderWithAuth();

    const button = screen.getByRole("button", { name: /register/i });
    expect(button).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
