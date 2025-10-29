import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { theme } = await req.json();

    if (theme !== "light" && theme !== "dark") {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true, theme });
    
    res.cookies.set("app-theme", theme, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }
}
