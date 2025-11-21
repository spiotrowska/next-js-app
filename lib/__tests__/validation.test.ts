import { startupFormSchema } from "@/lib/validation";
import { z } from "zod";

describe("validation", () => {
  test("startupFormSchema accepts valid input", () => {
    const data = {
      title: "My Startup",
      description: "A cool new thing that clearly exceeds twenty chars",
      category: "SaaS",
      link: "https://example.com/image.png",
      pitch: "We disrupt something boldly.",
      github: "https://github.com/example/repo",
      website: "https://example.com",
    };
    const parsed = startupFormSchema.parse(data);
    expect(parsed).toMatchObject(data);
  });

  test("startupFormSchema rejects invalid github url", () => {
    expect(() =>
      startupFormSchema.parse({
        title: "X",
        description: "Y",
        category: "Z",
        link: "https://example.com/image.png",
        pitch: "P",
        github: "not-a-url",
        website: "https://example.com",
      })
    ).toThrow(z.ZodError);
  });
});
