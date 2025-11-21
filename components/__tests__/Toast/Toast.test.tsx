import React from "react";
import { render, screen } from "@testing-library/react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

// Basic test ensuring toast appears after calling toast()
describe("Toast system", () => {
  test("renders a toast with title and description", () => {
    toast({ title: "Hello", description: "World" });
    render(<Toaster />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });
});
