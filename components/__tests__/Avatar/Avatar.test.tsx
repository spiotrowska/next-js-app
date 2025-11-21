import React from "react";
import { render } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

describe("Avatar", () => {
  test("renders container and fallback with image prop", () => {
    const { getByText, container } = render(
      <Avatar>
        <AvatarImage src="/logo.png" alt="User" />
        <AvatarFallback>UU</AvatarFallback>
      </Avatar>
    );
    expect(container.querySelector(".relative")).toBeTruthy();
    expect(getByText("UU")).toBeInTheDocument();
  });
  test("renders fallback when image empty", () => {
    const { getByText } = render(
      <Avatar>
        <AvatarImage src="" alt="" />
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
    );
    expect(getByText("FB")).toBeInTheDocument();
  });
});
