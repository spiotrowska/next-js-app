import React from "react";
import { render } from "@testing-library/react";
import { ToastProvider, Toast, ToastViewport } from "@/components/ui/toast";

describe("Toast default variant", () => {
  test("renders with default variant classes", () => {
    render(
      <ToastProvider>
        <Toast open>
          <span>Hi</span>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    // Default variant has non-destructive styling; ensure destructive not present.
    const anyToast = document.querySelector('[data-state="open"]');
    expect(anyToast).toBeTruthy();
    expect(anyToast!.className).not.toMatch(/destructive/);
  });
});
