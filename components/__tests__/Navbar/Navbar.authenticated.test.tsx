import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@/auth", () => ({
  auth: jest.fn(async () => ({
    user: { id: "u1", name: "Jane Doe", image: "" },
  })),
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

describe("Navbar authenticated", () => {
  test("shows create, logout and avatar", async () => {
    const ui = await Navbar();
    render(<ThemeProvider>{ui}</ThemeProvider>);
    expect(screen.getByText(/create/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    // AvatarFallback text 'AV'
    expect(screen.getByText("AV")).toBeInTheDocument();
  });
});
