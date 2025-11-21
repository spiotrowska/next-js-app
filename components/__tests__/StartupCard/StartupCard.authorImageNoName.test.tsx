import React from "react";
import { render } from "@testing-library/react";
import StartupCard from "@/components/StartupCard";
jest.mock("next/image", () => (props: any) => <img {...props} />);

describe("StartupCard author image alt fallback", () => {
  test("uses 'author' alt when author has image but no name", () => {
    const post: any = {
      _id: "alt1",
      _createdAt: new Date().toISOString(),
      views: 10,
      title: "Alt Fallback Startup",
      category: "Finance",
      image: "", // avoid startup main image
      description: "Fallback description long enough.",
      slug: { current: "alt-fallback" },
      author: { _id: "a1", image: "/author.png" },
    };
    const { container } = render(<StartupCard post={post} />);
    const avatarImg = container.querySelector('img[alt="author"]');
    expect(avatarImg).toBeTruthy();
    expect(avatarImg?.getAttribute("src")).toBe("/author.png");
  });
});
