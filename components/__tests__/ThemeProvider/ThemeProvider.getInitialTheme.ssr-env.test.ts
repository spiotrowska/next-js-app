/** @jest-environment node */
import { getInitialTheme } from "@/components/ThemeProvider";

describe("getInitialTheme SSR node environment", () => {
  test("returns light without document (SSR)", () => {
    // In node environment, document is undefined so first guard should return early.
    const theme = getInitialTheme();
    expect(theme).toBe("light");
  });
});
