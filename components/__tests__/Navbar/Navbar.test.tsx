import React from "react";
import { render, screen } from "@testing-library/react";

// Mock auth & signIn/signOut
jest.mock("@/auth", () => ({
  auth: jest.fn(async () => null),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: (props: any) => <a {...props}>{props.children}</a>,
}));
jest.mock("next/image", () => (props: any) => <img {...props} />);

import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/ThemeProvider";
// matchMedia mock for ThemeProvider
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

describe("Navbar", () => {
  test("renders logo and login when not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValueOnce(null);
    const ui = await Navbar();
    render(<ThemeProvider>{ui}</ThemeProvider>);
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
