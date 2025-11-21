import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => ({
    status: "SUCCESS",
    _id: "valid-1",
    error: null,
  })),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));
jest.mock("@uiw/react-md-editor", () => (props: any) => (
  <textarea
    id={props.id}
    onChange={(e) => props.onChange(e.target.value)}
    value={props.value}
  />
));

import StartupForm from "@/components/StartupForm";

describe("StartupForm all-valid no error paragraphs", () => {
  test("no error paragraphs render when all fields valid", async () => {
    const user = userEvent.setup();
    render(<StartupForm />);
    await user.type(screen.getByLabelText(/title/i), "Valid Title");
    await user.type(
      screen.getByLabelText(/description/i),
      "This description easily exceeds twenty characters for validation."
    );
    await user.type(screen.getByLabelText(/category/i), "Tech");
    await user.type(
      screen.getByLabelText(/image url/i),
      "https://example.com/image.png"
    );
    await user.type(screen.getByLabelText(/pitch/i), "A valid pitch value.");
    // Assert absence of each error block before submit.
    expect(screen.queryByText(/>=3 characters/i)).toBeNull();
    expect(screen.queryByText(/>=20 characters/i)).toBeNull();
    expect(screen.queryByText(/>=10 characters/i)).toBeNull();
    await user.click(
      screen.getByRole("button", { name: /submit your pitch/i })
    );
  });
});
