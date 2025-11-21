import { createPitch } from "@/lib/actions";

// Session returns user object lacking id to exercise optional chain variant session?.user?.id
jest.mock("@/auth", () => ({ auth: jest.fn(async () => ({ user: {} })) }));
jest.mock("@/sanity/lib/write-client", () => ({
  writeClient: { create: jest.fn(async (doc) => ({ _id: "noid123", ...doc })) },
}));

import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/write-client";

describe("createPitch authorRef missing id", () => {
  const formDataFrom = (values: Record<string, string>): FormData => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v));
    return fd;
  };

  test("author _ref is undefined when user object lacks id property", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: {} });
    const fd = formDataFrom({
      title: "Missing Id Startup",
      description: "Long description passes validation.",
      category: "Tech",
      link: "https://example.com/img.png",
      pitch: "Pitch content adequate",
    });
    const result = await createPitch(fd, "Pitch content adequate");
    expect(result.status).toBe("SUCCESS");
    const arg = (writeClient.create as jest.Mock).mock.calls[0][0];
    expect(arg.author._ref).toBeUndefined();
  });
});
