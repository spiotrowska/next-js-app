import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => ({ status: "ERROR", error: "ignored" })),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
const toastMock = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));
jest.mock("@uiw/react-md-editor", () => (props: any) => (
  <textarea
    id={props.id}
    onChange={(e) => props.onChange(e.target.value)}
    value={props.value}
  />
));

import StartupForm from "@/components/StartupForm";

describe("StartupForm single-field error", () => {
  test("only description error appears when description invalid and others valid", async () => {
    const user = userEvent.setup();
    render(<StartupForm />);
    await user.type(screen.getByLabelText(/title/i), "Valid Title");
    await user.type(screen.getByLabelText(/category/i), "Tech");
    await user.type(
      screen.getByLabelText(/image url/i),
      "https://example.com/img.png"
    );
    await user.type(screen.getByLabelText(/pitch/i), "A valid pitch string.");
    // Invalid description only (too short)
    await user.type(screen.getByLabelText(/description/i), "short");
    await user.click(
      screen.getByRole("button", { name: /submit your pitch/i })
    );
    // Wait for description error paragraph to appear.
    const descError = await screen.findByText(/>=20 characters/i);
    expect(descError).toBeInTheDocument();
    // Other field errors absent.
    expect(screen.queryByText(/>=3 characters/i)).toBeNull();
    expect(screen.queryByText(/>=10 characters/i)).toBeNull();
    expect(toastMock).toHaveBeenCalled();
  });
});
