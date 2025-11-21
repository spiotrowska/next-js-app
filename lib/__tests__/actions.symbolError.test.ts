import { createPitch } from "@/lib/actions";

jest.mock("@/auth", () => ({
  auth: jest.fn(async () => ({ user: { id: "userSym" } })),
}));
jest.mock("@/sanity/lib/write-client", () => ({
  writeClient: {
    create: jest.fn(async () => {
      throw Symbol("x");
    }),
  },
}));

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

describe("createPitch symbol error branch", () => {
  const formDataFrom = (values: Record<string, string>): FormData => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    return fd;
  };

  test("returns ERROR with undefined error when writeClient throws Symbol", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { id: "userSym" } });
    const fd = formDataFrom({
      title: "Symbol Error Startup",
      description: "Long description passes validation.",
      category: "Tech",
      link: "https://example.com/img.png",
      pitch: "Pitch content adequate",
    });
    const result = await createPitch(fd, "Pitch content adequate");
    expect(result.status).toBe("ERROR");
    // JSON.stringify(Symbol('x')) produces undefined -> branch ensures this path is covered.
    expect(result.error).toBeUndefined();
    expect(writeClient.create).toHaveBeenCalledTimes(1);
  });
});
