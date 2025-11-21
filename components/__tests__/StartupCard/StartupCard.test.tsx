import React from "react";
import { render, screen } from "@testing-library/react";
import StartupCard, { StartupCardSkeleton } from "@/components/StartupCard";

// Mock next/image to simple img for JSDOM.
jest.mock("next/image", () => (props: any) => <img {...props} />);

const sample = {
  _id: "abc123",
  _createdAt: new Date().toISOString(),
  views: 42,
  title: "Test Startup",
  category: "Tech",
  image: "/logo.png",
  description: "A short description that is visible.",
  slug: { current: "test-startup" },
  author: { _id: "u1", name: "Alice", image: "/logo.png", username: "alice" },
};

describe("StartupCard", () => {
  test("renders startup data", () => {
    render(<StartupCard post={sample as any} />);
    expect(screen.getByText("Test Startup")).toBeInTheDocument();
    expect(screen.getByText("Tech")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /test startup/i })
    ).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  test("skeleton renders 5 placeholders", () => {
    render(<StartupCardSkeleton />);
    const articles = screen.getAllByRole("article");
    expect(articles.length).toBe(5);
  });
});
