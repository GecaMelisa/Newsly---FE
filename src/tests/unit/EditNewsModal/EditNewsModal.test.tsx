import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import EditNewsModal from "../../../components/EditNewsModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock token utils
vi.mock("../../../utils/tokenUtils", () => ({
  getUserIdFromToken: () => 1,
}));

// Mock API
vi.mock("../../../api/newsApi", () => ({
  updateNews: vi.fn().mockResolvedValue({}),
}));

const renderModal = (props = {}) => {
  const queryClient = new QueryClient();
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    news: {
      id: 1,
      title: "Original Title",
      content: "Original content",
      category_name: "Tech",
      date: "15.06.2025.",
      user_id: 1,
    },
    ...props,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <EditNewsModal {...defaultProps} />
    </QueryClientProvider>
  );
};

describe("EditNewsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders with pre-filled fields", async () => {
    renderModal();

    expect(screen.getByDisplayValue("Original Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Original content")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tech")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-06-15")).toBeInTheDocument(); // formatted
  });

  test("updates form inputs", () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Title" },
    });

    expect(screen.getByLabelText(/title/i)).toHaveValue("Updated Title");
  });

  test("shows warning if required fields are empty", () => {
    renderModal();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    expect(require("react-toastify").toast.warn).toHaveBeenCalledWith(
      "All fields are required."
    );
  });

  test("calls updateNews on submit with correct payload", async () => {
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(require("../../../api/newsApi").updateNews).toHaveBeenCalledWith({
        id: 1,
        title: "Original Title",
        content: "Original content",
        category_name: "Tech",
        date: "15.06.2025.",
        user_id: 1,
      });
    });

    expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
      "News updated successfully! 🎉"
    );
  });

  test("calls onClose when Cancel button is clicked", () => {
    const mockOnClose = vi.fn();
    renderModal({ onClose: mockOnClose });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
