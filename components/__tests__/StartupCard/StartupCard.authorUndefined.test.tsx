import React from "react";
import { render } from "@testing-library/react";
import StartupCard from "@/components/StartupCard";
jest.mock("next/image", () => (props: any) => <img {...props} />);

describe("StartupCard author undefined", () => {
  test("renders without crashing when author is undefined", () => {
    const post: any = {
      _id: "undef1",
      _createdAt: new Date().toISOString(),
      views: 5,
      title: "No Author Startup",
      category: "Tech",
      image: "", // ensure image branch chooses null early return
      description: "Description long enough.",
      slug: { current: "no-author" },
      author: undefined,
    };
    const { getByText } = render(<StartupCard post={post} />);
    // Title and category still render
    expect(getByText("No Author Startup")).toBeTruthy();
    expect(getByText("Tech")).toBeTruthy();
  });
});
