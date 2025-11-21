import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StartupForm from "@/components/StartupForm";

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
jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => ({
    status: "SUCCESS",
    _id: "x1",
    error: null,
  })),
}));

describe("StartupForm pitch validation error", () => {
  test("shows pitch error when pitch empty but other fields valid", async () => {
    render(<StartupForm />);
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Valid Title" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: {
        value: "A long valid description for startup idea that passes length.",
      },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "Tech" },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "https://example.com/img.png" },
    });
    // Leave pitch empty triggers schema error
    fireEvent.submit(
      screen.getByRole("button", { name: /submit/i }).closest("form")!
    );
    await waitFor(() => {
      const pitchError = screen.getByText(/Too small: expected string to have/);
      expect(pitchError).toBeInTheDocument();
    });
  });
});
