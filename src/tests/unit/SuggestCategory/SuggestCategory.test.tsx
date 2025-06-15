import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import SuggestCategory from "../../../components/SuggestCategory";

describe("SuggestCategory Component", () => {
  test("renders Suggest Category button", () => {
    render(<SuggestCategory onSuggest={vi.fn()} />);
    const button = screen.getByRole("button", { name: /suggest category/i });
    expect(button).toBeInTheDocument();
  });

  test("calls onSuggest when button is clicked", () => {
    const mockOnSuggest = vi.fn();
    render(<SuggestCategory onSuggest={mockOnSuggest} />);

    const button = screen.getByRole("button", { name: /suggest category/i });
    fireEvent.click(button);

    expect(mockOnSuggest).toHaveBeenCalledTimes(1);
  });
});
