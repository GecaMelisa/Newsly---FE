import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import NewsDetailsModal from "../../../components/NewsDetailsModal";

describe("NewsDetailsModal", () => {
  const mockNews = {
    id: 1,
    user_id: 29,
    title: "Breaking News",
    content: "Some breaking content goes here.",
    date: "2025-06-15T10:00:00Z",
    category_name: "World",
    user_name: "Admin",
    email: "admin@example.com",
  };

  test("renders nothing if news is null", () => {
    const { container } = render(
      <NewsDetailsModal open={true} onClose={vi.fn()} news={null} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders news details when news is provided", () => {
    render(<NewsDetailsModal open={true} onClose={vi.fn()} news={mockNews} />);

    expect(screen.getByText(/breaking news/i)).toBeInTheDocument();
    expect(screen.getByText(/some breaking content/i)).toBeInTheDocument();
    expect(screen.getByText(/15\/06\/2025/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const mockOnClose = vi.fn();

    render(
      <NewsDetailsModal open={true} onClose={mockOnClose} news={mockNews} />
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
