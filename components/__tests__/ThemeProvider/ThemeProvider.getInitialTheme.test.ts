import { getInitialTheme } from "@/components/ThemeProvider";

describe("getInitialTheme unit branches", () => {
  const originalDocument = global.document;

  afterEach(() => {
    if (originalDocument) (global as any).document = originalDocument;
    // Expire theme cookie explicitly
    document.cookie = "app-theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  test("SSR fallback returns light when document undefined", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({ matches: false }),
    });
    (global as any).document = undefined;
    const theme = getInitialTheme();
    expect(theme).toBe("light");
  });

  test("cookie theme returns early (dark)", () => {
    document.cookie = "app-theme=dark";
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({ matches: false }),
    });
    const theme = getInitialTheme();
    expect(theme).toBe("dark");
  });

  test("prefers dark when no cookie and matchMedia true", () => {
    document.cookie = "";
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({ matches: true }),
    });
    const theme = getInitialTheme();
    expect(theme).toBe("dark");
  });

  test("final light fallback when no cookie and prefers light", () => {
    // Ensure previous dark cookie removed
    document.cookie = "app-theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({ matches: false }),
    });
    const theme = getInitialTheme();
    expect(theme).toBe("light");
  });
});
