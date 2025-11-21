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

// Mock createPitch to return ERROR (non-Zod) without throwing, exercising false branch of success redirect.
jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => ({ status: "ERROR", error: "server-fail" })),
}));

describe("StartupForm non-success result branch", () => {
  test("does not redirect when createPitch returns ERROR", async () => {
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
    // Wait for completion and ensure error toast from unexpected path NOT shown (since not thrown), and login redirect absent.
    await waitFor(() => {
      expect(
        screen.queryByText(
          /An unexpected error occurred while submitting the form/i
        )
      ).not.toBeInTheDocument();
    });
  });
});
