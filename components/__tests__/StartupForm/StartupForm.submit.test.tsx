import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mocks before component import.
jest.mock("@/lib/actions", () => ({
  createPitch: jest.fn(async () => ({
    status: "SUCCESS",
    _id: "mock-form-id",
    error: null,
  })),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
// Stable toast mock so we can assert calls.
const toastMock = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

import StartupForm from "@/components/StartupForm";
import { createPitch } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { formSchema } from "@/lib/validation";
import { z } from "zod";

describe("StartupForm submission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("successful submission triggers server action", async () => {
    const user = userEvent.setup();
    render(<StartupForm />);

    await user.type(screen.getByLabelText(/title/i), "Valid Title");
    await user.type(
      screen.getByLabelText(/description/i),
      "This description is definitely long enough to pass validation."
    );
    await user.type(screen.getByLabelText(/category/i), "Tech");
    await user.type(
      screen.getByLabelText(/Image URL/i),
      "https://example.com/image.png"
    );
    // Pitch editor mocked; simulate typing by focusing underlying textarea placeholder.
    const pitchField = screen.getByLabelText(/pitch/i);
    await user.type(pitchField, "A sufficiently long pitch string.");

    await user.click(
      screen.getByRole("button", { name: /submit your pitch/i })
    );
    expect(createPitch).toHaveBeenCalledTimes(1);
    expect(toastMock).not.toHaveBeenCalled();
  });

  test("renders validation errors on invalid data (mocked parse failure)", async () => {
    const user = userEvent.setup();
    render(<StartupForm />);
    const toast = (useToast() as any).toast;

    // Too short title and description and pitch.
    await user.type(screen.getByLabelText(/title/i), "aa"); // needs >=3
    await user.type(screen.getByLabelText(/description/i), "short"); // needs >=20
    await user.type(screen.getByLabelText(/category/i), "ab"); // needs >=3
    await user.type(
      screen.getByLabelText(/Image URL/i),
      "https://example.com/image.png"
    );
    const pitchField = screen.getByLabelText(/pitch/i);
    await user.type(pitchField, "tiny"); // needs >=10

    // Force parse failure explicitly to ensure validation branch.
    jest
      .spyOn(formSchema, "parseAsync")
      .mockRejectedValueOnce(new z.ZodError([]));

    await user.click(
      screen.getByRole("button", { name: /submit your pitch/i })
    );

    // Should not call createPitch because Zod fails first.
    expect(createPitch).not.toHaveBeenCalled();
    // Toast invoked with validation error.
    expect(toastMock).toHaveBeenCalled();
  });
});
