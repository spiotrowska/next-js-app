import { createPitch } from "@/lib/actions";

// Mock auth and writeClient dependencies.
jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/sanity/lib/write-client", () => ({
  writeClient: { create: jest.fn(async (doc) => ({ _id: "new123", ...doc })) },
}));

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

describe("createPitch server action", () => {
  const formDataFrom = (values: Record<string, string>): FormData => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    return fd;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns ERROR when unauthorized", async () => {
    (auth as jest.Mock).mockResolvedValueOnce(null);
    const fd = formDataFrom({
      title: "Test Title",
      description:
        "A valid long description for startup that exceeds minimum length",
      category: "Tech",
      link: "https://example.com",
      pitch: "Valid pitch data",
    });
    const result = await createPitch(fd, "Valid pitch data");
    expect(result.status).toBe("ERROR");
    expect(result.error).toBe("Unauthorized");
    expect(writeClient.create).not.toHaveBeenCalled();
  });

  test("creates pitch when authorized and returns SUCCESS with slug", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { id: "user123" } });
    const fd = formDataFrom({
      title: "My Great Startup",
      description:
        "This is a long enough description that passes validation easily.",
      category: "Health",
      link: "https://example.com/image.png",
      pitch: "Solves a big problem for many users",
    });
    const result = await createPitch(fd, "Solves a big problem for many users");
    expect(result.status).toBe("SUCCESS");
    expect(result.error).toBeNull();
    expect(result._id).toBeDefined();
    expect(writeClient.create).toHaveBeenCalledTimes(1);
    const arg = (writeClient.create as jest.Mock).mock.calls[0][0];
    expect(arg.slug.current).toBe("my-great-startup");
    expect(arg.author._ref).toBe("user123");
  });

  test("creates pitch when session present but user missing (author ref undefined)", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({});
    const fd = formDataFrom({
      title: "Edge Case Startup",
      description:
        "This is a long enough description that passes validation easily.",
      category: "Finance",
      link: "https://example.com/image2.png",
      pitch: "Edge case pitch data",
    });
    const result = await createPitch(fd, "Edge case pitch data");
    expect(result.status).toBe("SUCCESS");
    const arg = (writeClient.create as jest.Mock).mock.calls[
      (writeClient.create as jest.Mock).mock.calls.length - 1
    ][0];
    expect(arg.author._ref).toBeUndefined();
  });

  test("creates pitch when session has null user (author ref undefined)", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: null });
    const fd = formDataFrom({
      title: "Null User Startup",
      description: "Description long enough for validation.",
      category: "AI",
      link: "https://example.com/null.png",
      pitch: "Null user pitch",
    });
    const result = await createPitch(fd, "Null user pitch");
    expect(result.status).toBe("SUCCESS");
    const arg = (writeClient.create as jest.Mock).mock.calls[
      (writeClient.create as jest.Mock).mock.calls.length - 1
    ][0];
    expect(arg.author._ref).toBeUndefined();
  });

  test("returns ERROR when writeClient.create throws", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { id: "user123" } });
    (writeClient.create as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    const fd = formDataFrom({
      title: "Err Startup",
      description:
        "This is a long enough description that passes validation easily.",
      category: "Tech",
      link: "https://example.com/img.png",
      pitch: "Pitch content long enough",
    });
    const result = await createPitch(fd, "Pitch content long enough");
    expect(result.status).toBe("ERROR");
    expect(result.error).toMatch(/fail/);
  });

  test("returns ERROR when writeClient.create rejects with string", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { id: "user123" } });
    (writeClient.create as jest.Mock).mockRejectedValueOnce("string-fail");
    const fd = formDataFrom({
      title: "Err2 Startup",
      description: "Another long description that passes validation easily.",
      category: "Tech",
      link: "https://example.com/img2.png",
      pitch: "Pitch content adequate",
    });
    const result = await createPitch(fd, "Pitch content adequate");
    expect(result.status).toBe("ERROR");
    expect(result.error).toBe("string-fail");
  });

  test("returns ERROR when writeClient.create rejects with number", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { id: "user123" } });
    (writeClient.create as jest.Mock).mockRejectedValueOnce(404);
    const fd = formDataFrom({
      title: "Err3 Startup",
      description: "Yet another long description passes validation easily.",
      category: "Tech",
      link: "https://example.com/img3.png",
      pitch: "Pitch content adequate again",
    });
    const result = await createPitch(fd, "Pitch content adequate again");
    expect(result.status).toBe("ERROR");
    expect(result.error).toBe("404");
  });
});
