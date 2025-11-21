import React from "react";
import { render, screen } from "@testing-library/react";

// Mock auth upfront so env assertions in real module are skipped.
jest.mock("@/auth", () => ({
  auth: jest.fn(async () => ({
    user: { id: "img1", name: "Img User", image: "https://example.com/u.png" },
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
import { auth } from "@/auth";

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

describe("Navbar additional authenticated variants", () => {
  test("authenticated with user image present (non-empty image branch)", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({
      user: {
        id: "img1",
        name: "Img User",
        image: "https://example.com/u.png",
      },
    });
    const ui = await Navbar();
    render(<ThemeProvider>{ui}</ThemeProvider>);
    // Assert user profile link rendered; image OR branch executed.
    expect(screen.getByRole("link", { name: /av/i })).toHaveAttribute(
      "href",
      "/user/img1"
    );
  });

  test("authenticated with empty name triggers alt fallback branch (name OR falsy)", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({
      user: { id: "noname", name: "", image: "https://example.com/na.png" },
    });
    const ui = await Navbar();
    render(<ThemeProvider>{ui}</ThemeProvider>);
    expect(screen.getByRole("link", { name: /av/i })).toHaveAttribute(
      "href",
      "/user/noname"
    );
  });
});
