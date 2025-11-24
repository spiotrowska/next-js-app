import React from "react";
import { render, screen } from "@testing-library/react";
import View from "@/components/View";

// Mocks with capture of arguments for coverage & behavior assertions.
const fetchMock = jest.fn(async () => ({ views: 5 }));
const setCalls: Array<{ views: number }> = [];
const commitMock = jest.fn(async () => ({ _id: "id" }));

jest.mock("@/sanity/lib/client", () => ({
  client: {
    withConfig: () => ({ fetch: fetchMock }),
  },
}));
jest.mock("next/server", () => ({ after: (fn: any) => fn() }));
jest.mock("@/sanity/lib/write-client", () => ({
  writeClient: {
    patch: () => ({
      set: (payload: { views: number }) => {
        setCalls.push(payload);
        return { commit: commitMock };
      },
    }),
  },
}));

describe("View", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ views: 5 });
    commitMock.mockClear();
    setCalls.length = 0;
  });

  test("renders non-zero views and increments correctly", async () => {
    const ui = await View({ id: "abc" });
    render(ui);
    expect(screen.getByText("Views: 5")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(setCalls[0]).toEqual({ views: 6 }); // totalViews + 1
    expect(commitMock).toHaveBeenCalledTimes(1);
  });

  test("renders zero views fallback and increments to 1", async () => {
    fetchMock.mockResolvedValueOnce({ views: 0 });
    const ui = await View({ id: "zero" });
    render(ui);
    expect(screen.getByText("Views: 0")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(setCalls[0]).toEqual({ views: 1 }); // 0 + 1
    expect(commitMock).toHaveBeenCalledTimes(1);
  });
});
