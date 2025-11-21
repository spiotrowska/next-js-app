import React from "react";
import Navbar from "@/components/Navbar";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

import { auth, signIn, signOut } from "@/auth";

function collectForms(el: any, acc: any[] = []): any[] {
  if (!el || typeof el !== "object") return acc;
  if (el.type === "form") acc.push(el);
  const children = el.props?.children;
  if (Array.isArray(children)) children.forEach((c) => collectForms(c, acc));
  else if (children) collectForms(children, acc);
  return acc;
}

describe("Navbar inline server actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("invokes signOut server action in authenticated branch", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({
      user: { id: "u1", name: "Jane" },
    });
    const element = await Navbar();
    const forms = collectForms(element);
    // Authenticated should have two forms: logout form only (signOut) plus maybe none else.
    const logoutForm = forms.find((f) => {
      const btn = findText(f, "Logout");
      return !!btn;
    });
    expect(logoutForm).toBeTruthy();
    await logoutForm.props.action();
    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/" });
  });

  test("invokes signIn server action in unauthenticated branch", async () => {
    (auth as jest.Mock).mockResolvedValueOnce(null);
    const element = await Navbar();
    const forms = collectForms(element);
    const loginForm = forms.find((f) => findText(f, "Login"));
    expect(loginForm).toBeTruthy();
    await loginForm.props.action();
    expect(signIn).toHaveBeenCalledWith("github");
  });
});

function findText(node: any, text: string): any | null {
  if (!node || typeof node !== "object") return null;
  const children = node.props?.children;
  if (typeof children === "string")
    return children.includes(text) ? node : null;
  if (Array.isArray(children)) {
    for (const c of children) {
      const found = findText(c, text);
      if (found) return found;
    }
  } else if (children) return findText(children, text);
  return null;
}
