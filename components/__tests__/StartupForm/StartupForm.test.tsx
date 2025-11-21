import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// Mock server actions before importing the component to avoid executing Sanity client/env logic.
jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => ({
    status: "SUCCESS",
    _id: "mock-id",
    error: null,
  })),
}));

// Mock Next.js router for App Router hooks.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

import StartupForm from "@/components/StartupForm";

// NOTE: This is a light smoke test; deeper tests would mock server actions & Sanity writes.

describe("StartupForm", () => {
  test("renders form fields and allows typing", async () => {
    const user = userEvent.setup();
    render(<StartupForm />);

    const title = screen.getByLabelText(/title/i);
    await user.type(title, "My Startup");
    expect(title).toHaveValue("My Startup");
  });
});
