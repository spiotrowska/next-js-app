import React from "react";
import { render } from "@testing-library/react";
import StartupCard from "@/components/StartupCard";
jest.mock("next/image", () => (props: any) => <img {...props} />);

const base = {
  _id: "f1",
  _createdAt: new Date().toISOString(),
  views: 3,
  category: "Tech",
  image: "/logo.png",
  description: "Desc",
  slug: { current: "fallback" },
};

describe("StartupCard author name fallback chain", () => {
  test("uses username when name missing", () => {
    const post: any = {
      ...base,
      title: "X",
      author: { _id: "a", username: "user123" },
    };
    const { getByText } = render(<StartupCard post={post} />);
    expect(getByText("user123")).toBeInTheDocument();
  });
  test("uses email when name and username missing", () => {
    const post: any = {
      ...base,
      title: "Y",
      author: { _id: "a", email: "a@example.com" },
    };
    const { getByText } = render(<StartupCard post={post} />);
    expect(getByText("a@example.com")).toBeInTheDocument();
  });
  test("does not render image when title missing even if image present", () => {
    const post: any = {
      ...base,
      title: "",
      author: { _id: "a", name: "Alice" },
    };
    const { queryByAltText } = render(<StartupCard post={post} />);
    expect(queryByAltText("")).toBeNull();
  });
});
