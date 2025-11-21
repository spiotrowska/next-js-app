import { createPitch } from "@/lib/actions";

jest.mock("@/auth", () => ({
  auth: jest.fn(async () => ({ user: { id: "userX" } })),
}));
jest.mock("@/sanity/lib/write-client", () => ({
  writeClient: {
    create: jest.fn(async () => {
      throw { code: 500, msg: "server" };
    }),
  },
}));

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

describe("createPitch object error branch", () => {
  const formDataFrom = (values: Record<string, string>): FormData => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    return fd;
  };

  test("returns ERROR with JSON stringified object when writeClient throws object", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { id: "userX" } });
    const fd = formDataFrom({
      title: "Obj Error Startup",
      description: "Long description passes validation.",
      category: "Tech",
      link: "https://example.com/img.png",
      pitch: "Pitch content adequate",
    });
    const result = await createPitch(fd, "Pitch content adequate");
    expect(result.status).toBe("ERROR");
    expect(result.error).toMatch(/code/);
    expect(writeClient.create).toHaveBeenCalledTimes(1);
  });
});
