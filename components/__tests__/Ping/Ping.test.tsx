import React from "react";
import { render } from "@testing-library/react";
import Ping from "@/components/Ping";

describe("Ping", () => {
  test("renders ping wrapper", () => {
    const { container } = render(<Ping />);
    expect(container.querySelector(".relative")).toBeTruthy();
  });
});
