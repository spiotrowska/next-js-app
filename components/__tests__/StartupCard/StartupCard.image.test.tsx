import React from "react";
import { render } from "@testing-library/react";
import StartupCard from "@/components/StartupCard";
jest.mock("next/image", () => (props: any) => <img {...props} />);

describe("StartupCard image branch", () => {
  test("renders image when image and title provided", () => {
    const post: any = {
      _id: "img1",
      _createdAt: new Date().toISOString(),
      views: 10,
      author: { _id: "a", name: "Alice", image: "/author.png" },
      title: "Img Startup",
      category: "Tech",
      image: "/startup.png",
      description: "Desc",
      slug: { current: "img-startup" },
    };
    const { getByAltText } = render(<StartupCard post={post} />);
    expect(getByAltText("Img Startup")).toBeInTheDocument();
  });
});
