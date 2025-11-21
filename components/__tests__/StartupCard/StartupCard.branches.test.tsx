import React from "react";
import { render } from "@testing-library/react";
import StartupCard from "@/components/StartupCard";

jest.mock("next/image", () => (props: any) => <img {...props} />);

const base = {
  _id: "b1",
  _createdAt: new Date().toISOString(),
  views: 1,
  title: "Branch Startup",
  category: "Tech",
  image: "/logo.png",
  description: "Branch card description",
  slug: { current: "branch-startup" },
};

describe("StartupCard branches", () => {
  test("no author image and no post image conditional", () => {
    const post: any = {
      ...base,
      image: "",
      author: { _id: "u", name: "NoImg" },
    };
    const { queryByRole } = render(<StartupCard post={post} />);
    expect(queryByRole("img", { name: /branch startup/i })).toBeNull();
  });
  test("author image but no post image", () => {
    const post: any = {
      ...base,
      image: "",
      author: { _id: "u", name: "WithImg", image: "/logo.png" },
    };
    const { getByRole } = render(<StartupCard post={post} />);
    // avatar image present, startup image absent
    expect(getByRole("img", { name: /withimg/i })).toBeTruthy();
  });
});
