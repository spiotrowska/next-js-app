import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchFormReset from "@/components/SearchFormReset";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: (props: any) => <a {...props}>{props.children}</a>,
}));

describe("SearchFormReset", () => {
  test("renders reset button", () => {
    render(<SearchFormReset />);
    expect(
      screen.getByRole("button", { name: /reset search/i })
    ).toBeInTheDocument();
  });
  test("clicking reset clears input and navigates", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <form className="search-form">
          <input name="query" defaultValue="abc" />
        </form>
        <SearchFormReset />
      </div>
    );
    const input = screen.getByDisplayValue("abc");
    await user.click(screen.getByRole("button", { name: /reset search/i }));
    expect(input).toHaveValue("");
  });
});
