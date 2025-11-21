import React from "react";
import { render, screen } from "@testing-library/react";
import View from "@/components/View";

jest.mock("@/sanity/lib/client", () => ({
  client: {
    withConfig: () => ({ fetch: jest.fn(async () => ({ views: 5 })) }),
  },
}));
jest.mock("next/server", () => ({ after: (fn: any) => fn() }));
jest.mock("@/sanity/lib/write-client", () => ({
  writeClient: {
    patch: () => ({
      set: () => ({ commit: jest.fn(async () => ({ _id: "id" })) }),
    }),
  },
}));

describe("View", () => {
  test("renders views count and triggers increment", async () => {
    const ui = await View({ id: "abc" });
    render(ui);
    expect(screen.getByText(/Views: 5/)).toBeInTheDocument();
  });
});
