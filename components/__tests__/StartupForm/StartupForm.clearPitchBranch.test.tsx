import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock markdown editor to simple textarea
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
// Ensure createPitch not called due to validation failure after clearing pitch.
jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => ({
    status: "SUCCESS",
    _id: "clear-1",
    error: null,
  })),
}));
const toastMock = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

import StartupForm from "@/components/StartupForm";
import { createPitch } from "@/lib/actions";

describe("StartupForm pitch clear falsy branch", () => {
  test("clearing pitch triggers falsy value branch and validation error", async () => {
    const user = userEvent.setup();
    render(<StartupForm />);
    await user.type(screen.getByLabelText(/title/i), "Valid Title");
    await user.type(
      screen.getByLabelText(/description/i),
      "A long enough description exceeding twenty characters."
    );
    await user.type(screen.getByLabelText(/category/i), "Tech");
    await user.type(
      screen.getByLabelText(/image url/i),
      "https://example.com/img.png"
    );
    // Type then clear pitch to force falsy branch of (value || "")
    const pitchField = screen.getByLabelText(/pitch/i);
    await user.type(pitchField, "Initial pitch content long enough.");
    await user.clear(pitchField); // triggers setPitch("") via falsy branch
    await user.click(
      screen.getByRole("button", { name: /submit your pitch/i })
    );
    // Expect pitch length validation error appears
    const pitchError = await screen.findByText(/>=10 characters/i);
    expect(pitchError).toBeInTheDocument();
    // createPitch not called because validation failed
    expect(createPitch).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalled();
  });
});
