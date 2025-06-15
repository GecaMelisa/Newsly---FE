import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import CreateNewsModal from "../../../components/CreateNewsModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock token utils
vi.mock("../../../utils/tokenUtils", () => ({
  getUserIdFromToken: () => 1,
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock API calls
vi.mock("../../../api/newsApi", () => ({
  createNews: vi.fn().mockResolvedValue({
    id: 1,
    title: "Test Title",
    content: "Test Content",
    date: "15.06.2025.",
    category_name: "General",
    user_id: 1,
    user_name: "User",
    email: "user@example.com",
  }),
}));

vi.mock("../../../api/categoryApi", () => ({
  fetchCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "General" },
    { id: 2, name: "Tech" },
  ]),
  suggestCategory: vi.fn().mockResolvedValue("Tech"),
}));

const renderModal = (props = {}) => {
  const queryClient = new QueryClient();
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onNewsCreated: vi.fn(),
    ...props,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <CreateNewsModal {...defaultProps} />
    </QueryClientProvider>
  );
};

describe("CreateNewsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form fields correctly", async () => {
    renderModal();

    expect(await screen.findByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /suggest category/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("shows error if content is missing during suggestion", async () => {
    renderModal();

    fireEvent.click(screen.getByRole("button", { name: /suggest category/i }));

    await screen.findByText(
      /please write content to get a category suggestion/i
    );
  });

  test("submits the form with valid input", async () => {
    const mockOnNewsCreated = vi.fn();
    renderModal({ onNewsCreated: mockOnNewsCreated });

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "Test Content" },
    });
    fireEvent.mouseDown(screen.getByLabelText(/category name/i));
    fireEvent.click(await screen.findByText("General"));
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2025-06-15" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnNewsCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Title",
          content: "Test Content",
          category_name: "General",
          date: "15.06.2025.",
        })
      );
    });
  });

  test("calls onClose when cancel is clicked", () => {
    const mockOnClose = vi.fn();
    renderModal({ onClose: mockOnClose });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
