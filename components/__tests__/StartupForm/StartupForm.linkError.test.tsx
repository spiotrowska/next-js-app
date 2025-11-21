import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StartupForm from "@/components/StartupForm";
import { Toaster } from "@/components/ui/toaster";

jest.mock("@uiw/react-md-editor", () => (props: any) => (
  <textarea
    id={props.id}
    onChange={(e) => props.onChange(e.target.value)}
    value={props.value}
  />
));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
// Allow createPitch to not be called due to validation failure.
jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => ({
    status: "SUCCESS",
    _id: "skip",
    error: null,
  })),
}));

describe("StartupForm link URL validation error", () => {
  test("shows link error when invalid URL provided", async () => {
    render(
      <>
        <StartupForm />
        <Toaster />
      </>
    );
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Valid Title" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: {
        value:
          "A long enough description for validation to pass at least twenty chars.",
      },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "not-a-url" },
    });
    fireEvent.change(screen.getByLabelText(/pitch/i), {
      target: { value: "A sufficiently long pitch value." },
    });
    fireEvent.submit(
      screen
        .getByRole("button", { name: /submit your pitch/i })
        .closest("form")!
    );
    await waitFor(() => {
      expect(screen.getByText(/Invalid url/i)).toBeInTheDocument();
    });
  });
});
