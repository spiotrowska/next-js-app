import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@/auth", () => ({
  auth: jest.fn(async () => ({ user: null })), // session with explicit null user
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: (props: any) => <a {...props}>{props.children}</a>,
}));
jest.mock("next/image", () => (props: any) => <img {...props} />);

import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

describe("Navbar session null user", () => {
  test("renders login when user is null in session object", async () => {
    const ui = await Navbar();
    render(<ThemeProvider>{ui}</ThemeProvider>);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
