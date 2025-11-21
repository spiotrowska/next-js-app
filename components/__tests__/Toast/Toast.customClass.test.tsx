import React from "react";
import { render } from "@testing-library/react";
import { ToastProvider, Toast, ToastViewport } from "@/components/ui/toast";

describe("Toast custom class merge", () => {
  test("merges provided className with variant classes", () => {
    render(
      <ToastProvider>
        <Toast open variant="default" className="extra-custom">
          <span>Custom Merge</span>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    const root = document.querySelector('[data-state="open"]');
    expect(root).toBeTruthy();
    // Custom class should be present
    expect(root!.className).toMatch(/extra-custom/);
    // Default variant styling includes bg-white
    expect(root!.className).toMatch(/bg-white/);
  });
});
