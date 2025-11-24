import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button component branches", () => {
  test("renders default button element when asChild is false", () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn.tagName.toLowerCase()).toBe("button");
  });

  test("renders child element (anchor) when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Anchor Child</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: /anchor child/i });
    expect(link).toHaveAttribute("href", "/test");
  });

  test("applies variant and size classes", () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>
    );
    const btn = screen.getByRole("button", { name: /delete/i });
    // Expect destructive styling substring and small size height class present.
    expect(btn.className).toMatch(/destructive/);
    expect(btn.className).toMatch(/h-8/);
  });

  test("merges custom class names", () => {
    render(<Button className="custom-class">Custom</Button>);
    const btn = screen.getByRole("button", { name: /custom/i });
    expect(btn.className).toMatch(/custom-class/);
  });

  test("forwards ref to underlying element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>RefBtn</Button>);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName.toLowerCase()).toBe("button");
  });
});
