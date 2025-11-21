import { createPitch } from "@/lib/actions";

jest.mock("@/auth", () => ({
  auth: jest.fn(async () => ({ user: { id: "circularUser" } })),
}));
jest.mock("@/sanity/lib/write-client", () => {
  const circular: any = {};
  circular.self = circular; // create circular reference to force JSON.stringify throw
  return {
    writeClient: {
      create: jest.fn(async () => {
        throw circular;
      }),
    },
  };
});

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

describe("createPitch circular object error branch", () => {
  const formDataFrom = (values: Record<string, string>): FormData => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    return fd;
  };

  test("returns ERROR with undefined error when JSON.stringify throws", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { id: "circularUser" } });
    const fd = formDataFrom({
      title: "Circular Error Startup",
      description: "Long description passes validation.",
      category: "Tech",
      link: "https://example.com/img.png",
      pitch: "Pitch content adequate",
    });
    const result = await createPitch(fd, "Pitch content adequate");
    expect(result.status).toBe("ERROR");
    expect(result.error).toBeUndefined(); // from catch branch setting message undefined
    expect(writeClient.create).toHaveBeenCalledTimes(1);
  });
});
