import { NextResponse } from "next/server";

// Non-faulty placeholder route retained after upgrade cleanup
export function GET() {
  return NextResponse.json({ status: "ok" });
}
