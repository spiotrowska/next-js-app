import React from "react";
import { render } from "@testing-library/react";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";

describe("Toast destructive variant", () => {
  test("applies destructive classes", () => {
    render(
      <ToastProvider>
        <Toast open variant="destructive" />
        <ToastViewport />
      </ToastProvider>
    );
    const el = document.body.querySelector(".destructive");
    expect(el).toBeTruthy();
  });
});
