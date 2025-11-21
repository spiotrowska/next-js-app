import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "@/components/SearchForm";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock next/form component to behave like a regular form.
jest.mock("next/form", () => ({
  __esModule: true,
  default: (props: any) => <form {...props}>{props.children}</form>,
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: (props: any) => <a {...props}>{props.children}</a>,
}));

describe("SearchForm", () => {
  test("renders input and both buttons when query provided", () => {
    render(<SearchForm query="abc" />);
    expect(screen.getByPlaceholderText(/search startup/i)).toHaveValue("abc");
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2); // reset + submit
  });

  test("allows typing (no submit simulation due to jsdom requestSubmit limitation)", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    const input = screen.getByPlaceholderText(/search startup/i);
    await user.type(input, "cloud");
    expect(input).toHaveValue("cloud");
  });
});
