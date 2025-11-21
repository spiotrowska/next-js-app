import { readThemeCookie, prefersDarkMode } from "@/components/ThemeProvider";

describe("ThemeProvider helpers", () => {
  beforeEach(() => {
    document.cookie = "";
  });

  test("readThemeCookie returns dark when cookie set to dark", () => {
    document.cookie = "app-theme=dark";
    expect(readThemeCookie()).toBe("dark");
  });

  test("readThemeCookie returns light when cookie set to light", () => {
    document.cookie = "app-theme=light";
    expect(readThemeCookie()).toBe("light");
  });

  test("readThemeCookie returns null for invalid cookie value", () => {
    document.cookie = "app-theme=blue";
    expect(readThemeCookie()).toBeNull();
  });

  test("prefersDarkMode reflects matchMedia true", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: true }),
    });
    expect(prefersDarkMode()).toBe(true);
  });

  test("prefersDarkMode reflects matchMedia false", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockReturnValue({ matches: false }),
    });
    expect(prefersDarkMode()).toBe(false);
  });
});
