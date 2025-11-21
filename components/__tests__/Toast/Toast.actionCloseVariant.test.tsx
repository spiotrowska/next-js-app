import React from "react";
import { render } from "@testing-library/react";
import {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastAction,
  ToastClose,
} from "@/components/ui/toast";

describe("ToastAction and ToastClose variant decomposition", () => {
  test("destructive variant applies group classes and preserves custom class on action & close", () => {
    render(
      <ToastProvider>
        <Toast open variant="destructive">
          <span>Message</span>
          <ToastAction className="extra-action" altText="Undo">
            Undo
          </ToastAction>
          <ToastClose className="extra-close" />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    const action = document.querySelector(".extra-action");
    const close = document.querySelector(".extra-close");
    expect(action).toBeTruthy();
    expect(action!.className).toMatch(/destructive/);
    expect(close).toBeTruthy();
    expect(close!.className).toMatch(/destructive/);
  });
});
