import React from "react";
import { render, screen } from "@testing-library/react";
import UserStartups from "@/components/UserStartups";

jest.mock("@/sanity/lib/client", () => ({
  client: {
    fetch: jest.fn(async (_q: string, { id }: any) =>
      id === "empty"
        ? []
        : [
            {
              _id: "s1",
              _createdAt: new Date().toISOString(),
              views: 10,
              title: "First",
              category: "Tech",
              image: "/logo.png",
              description: "Desc",
              slug: { current: "first" },
              author: { _id: "a1", name: "Alice" },
            },
          ]
    ),
  },
}));

describe("UserStartups", () => {
  test("renders startups when present", async () => {
    const ui = await UserStartups({ id: "user1" });
    render(ui);
    expect(screen.getByText(/First/)).toBeInTheDocument();
  });
  test("renders no result when empty", async () => {
    const ui = await UserStartups({ id: "empty" });
    render(ui);
    expect(screen.getByText(/No posts yet/i)).toBeInTheDocument();
  });
});
