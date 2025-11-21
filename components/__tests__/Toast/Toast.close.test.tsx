import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import {
  ToastProvider,
  Toast,
  ToastViewport,
  ToastClose,
} from "@/components/ui/toast";

describe("Toast close interaction", () => {
  test("clicking close triggers dismissal handler", async () => {
    const onOpenChange = jest.fn();
    render(
      <ToastProvider>
        <Toast open onOpenChange={onOpenChange}>
          <span>Message</span>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    const closeBtn = document.querySelector("[toast-close]") as HTMLElement;
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalled();
    });
  });
});
