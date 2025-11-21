import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Simplify markdown editor.
jest.mock("@uiw/react-md-editor", () => (props: any) => (
  <textarea
    id={props.id}
    onChange={(e) => props.onChange(e.target.value)}
    value={props.value}
  />
));

let createPitchMock: jest.Mock;
let pushMock: jest.Mock;

jest.mock("@/lib/actions", () => ({
  createPitch: (...args: any[]) => createPitchMock(...args),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

import StartupForm from "@/components/StartupForm";

describe("StartupForm additional branches", () => {
  beforeEach(() => {
    createPitchMock = jest.fn(async () => ({
      status: "SUCCESS",
      _id: "default-id",
      error: null,
    }));
    pushMock = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test("multi-field validation errors render all error paragraphs", async () => {
    // Prevent createPitch invocation on validation failure.
    createPitchMock = jest.fn();
    const user = userEvent.setup();
    render(<StartupForm />);

    await user.type(screen.getByLabelText(/title/i), "aa"); // min 3
    await user.type(screen.getByLabelText(/description/i), "short"); // min 20
    await user.type(screen.getByLabelText(/category/i), "ab"); // min 3
    await user.type(
      screen.getByLabelText(/image url/i),
      "https://example.com/img.png"
    );
    // leave pitch empty
    await user.click(
      screen.getByRole("button", { name: /submit your pitch/i })
    );

    await waitFor(() => {
      const threeCharErrors = screen.getAllByText(/>=3 characters/);
      expect(threeCharErrors.length).toBeGreaterThanOrEqual(2); // title + category
      expect(screen.getByText(/>=20 characters/)).toBeInTheDocument(); // description
      expect(screen.getByText(/>=10 characters/)).toBeInTheDocument(); // pitch
    });
    expect(createPitchMock).not.toHaveBeenCalled();
  });

  test("pending state disables submit button and shows submitting text", async () => {
    // Use real timers with a short delay to simulate async work.
    createPitchMock = jest.fn(
      () =>
        new Promise((res) =>
          setTimeout(
            () => res({ status: "SUCCESS", _id: "pending-id", error: null }),
            25
          )
        )
    );
    const user = userEvent.setup();
    render(<StartupForm />);

    await user.type(screen.getByLabelText(/title/i), "Valid Title");
    await user.type(
      screen.getByLabelText(/description/i),
      "A long description well over twenty characters."
    );
    await user.type(screen.getByLabelText(/category/i), "Tech");
    await user.type(
      screen.getByLabelText(/image url/i),
      "https://example.com/img.png"
    );
    await user.type(
      screen.getByLabelText(/pitch/i),
      "A sufficiently long pitch value."
    );

    const button = screen.getByRole("button", { name: /submit your pitch/i });
    await user.click(button);
    await waitFor(() => expect(button).toBeDisabled());
    expect(button).toHaveTextContent(/Submitting/i);
    await waitFor(() => expect(createPitchMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(button).not.toBeDisabled());
    expect(pushMock).toHaveBeenCalledWith("/startup/pending-id");
  });

  test("successful submission triggers redirect", async () => {
    createPitchMock = jest.fn(async () => ({
      status: "SUCCESS",
      _id: "redir-123",
      error: null,
    }));
    const user = userEvent.setup();
    render(<StartupForm />);
    await user.type(screen.getByLabelText(/title/i), "Valid Title");
    await user.type(
      screen.getByLabelText(/description/i),
      "Another valid description exceeding twenty characters easily."
    );
    await user.type(screen.getByLabelText(/category/i), "Tech");
    await user.type(
      screen.getByLabelText(/image url/i),
      "https://example.com/img.png"
    );
    await user.type(
      screen.getByLabelText(/pitch/i),
      "A sufficiently long pitch value."
    );
    await user.click(
      screen.getByRole("button", { name: /submit your pitch/i })
    );
    await waitFor(() => expect(createPitchMock).toHaveBeenCalledTimes(1));
    expect(pushMock).toHaveBeenCalledWith("/startup/redir-123");
  });
});
