import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import NewsCard from "../../../components/NewsCard";
import { AuthContext } from "../../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

// Mock token utility
vi.mock("../../../utils/tokenUtils", () => ({
  getUserEmailFromToken: () => "author@example.com",
}));

const mockNews = {
  id: 1,
  user_id: 99,
  title: "Sample News Title",
  content: "This is a sample content for testing the NewsCard component.",
  category_name: "Tech",
  date: "2024-12-30T12:00:00Z",
  user_name: "Author",
  email: "author@example.com",
};

describe("NewsCard Component", () => {
  const setup = (isLoggedIn = false) => {
    const onClick = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{ login: vi.fn(), logout: vi.fn(), isLoggedIn }}
        >
          <NewsCard
            news={mockNews}
            onClick={onClick}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    return { onClick, onEdit, onDelete };
  };

  test("renders title, content, date, author, and category", () => {
    setup();

    expect(screen.getByText("Sample News Title")).toBeInTheDocument();
    expect(screen.getByText(/sample content/i)).toBeInTheDocument();
    expect(screen.getByText(/Published by: Author/i)).toBeInTheDocument();
    expect(screen.getByText(/30\/12\/2024/)).toBeInTheDocument(); // formatted date
    expect(screen.getByText("Tech")).toBeInTheDocument(); // category chip
  });

  test("does not show Edit/Delete when not logged in", () => {
    setup(false);

    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();
  });

  test("shows Edit/Delete buttons when logged in as author", () => {
    setup(true);

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  test("calls onClick when card is clicked", () => {
    const { onClick } = setup(true);
    fireEvent.click(screen.getByText("Sample News Title"));
    expect(onClick).toHaveBeenCalled();
  });

  test("calls onEdit when Edit button is clicked", () => {
    const { onEdit } = setup(true);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockNews);
  });

  test("calls onDelete when Delete button is clicked", () => {
    const { onDelete } = setup(true);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(mockNews.id);
  });
});
