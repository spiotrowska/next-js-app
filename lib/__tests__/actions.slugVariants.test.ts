import { createPitch } from "@/lib/actions";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/sanity/lib/write-client", () => ({
  writeClient: { create: jest.fn(async (doc) => ({ _id: "slug123", ...doc })) },
}));

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

const formDataFrom = (values: Record<string, string>): FormData => {
  const fd = new FormData();
  Object.entries(values).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

describe("createPitch slug variants", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ user: { id: "user123" } });
  });

  test("slugifies title with punctuation, uppercase and numbers", async () => {
    const fd = formDataFrom({
      title: "My AMAZING, Startup!! 2025",
      description: "Long enough description for validation passes.",
      category: "Tech",
      link: "https://example.com/img.png",
      pitch: "Pitch body text",
    });
    const result = await createPitch(fd, "Pitch body text");
    expect(result.status).toBe("SUCCESS");
    const arg = (writeClient.create as jest.Mock).mock.calls[0][0];
    expect(arg.slug.current).toBe("my-amazing-startup-2025");
  });

  test("collapses repeated spaces and trims", async () => {
    const fd = formDataFrom({
      title: "   Foo   Bar   Baz  ",
      description: "Another adequate description for validation.",
      category: "Finance",
      link: "https://example.com/img2.png",
      pitch: "Pitch text",
    });
    const result = await createPitch(fd, "Pitch text");
    expect(result.status).toBe("SUCCESS");
    const arg = (writeClient.create as jest.Mock).mock.calls[0][0];
    expect(arg.slug.current).toBe("foo-bar-baz");
  });

  test("transliterates accented characters", async () => {
    const fd = formDataFrom({
      title: "Café Déjà Vu",
      description: "Accented title description sufficiently long.",
      category: "Food",
      link: "https://example.com/img3.png",
      pitch: "Pitch accented",
    });
    const result = await createPitch(fd, "Pitch accented");
    expect(result.status).toBe("SUCCESS");
    const arg = (writeClient.create as jest.Mock).mock.calls[0][0];
    // slugify should convert é -> e, à -> a
    expect(arg.slug.current).toBe("cafe-deja-vu");
  });
});
