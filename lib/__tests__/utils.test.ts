import { cn, formatDate, parseServerActionResponse } from "@/lib/utils";

describe("utils", () => {
  test("cn merges class names with tailwind-merge", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
  });

  test("formatDate returns readable date", () => {
    const iso = "2024-07-15T00:00:00.000Z";
    expect(formatDate(iso)).toMatch(/July/);
  });

  test("parseServerActionResponse deep clones plain object", () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = parseServerActionResponse(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });
});
