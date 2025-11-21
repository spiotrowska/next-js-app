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
// Mock createPitch to throw unexpected error after validation passes
jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => {
    throw new Error("unexpected");
  }),
}));

describe("StartupForm unexpected error branch", () => {
  test("shows generic unexpected error toast path", async () => {
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
      target: { value: "A sufficiently long description for validation pass." },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "https://example.com/img.png" },
    });
    fireEvent.change(screen.getByLabelText(/pitch/i), {
      target: { value: "A sufficiently long pitch value" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /submit/i }).closest("form")!
    );
    await waitFor(() => {
      // Toast description should appear via Toaster rendering.
      expect(
        screen.getByText(
          /An unexpected error occurred while submitting the form/i
        )
      ).toBeInTheDocument();
    });
  });
});
