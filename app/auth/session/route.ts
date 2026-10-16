import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";
import { serverAuth } from "@/lib/auth/server";

export async function GET() {
  const headers = { "Cache-Control": "private, no-store" };
  if (!authConfig()) return NextResponse.json({ userId: null }, { status: 503, headers });
  try {
    const client = await serverAuth(true);
    const { data, error } = await client.auth.getUser();
    return NextResponse.json({ userId: error ? null : data.user?.id ?? null }, { status: error || !data.user ? 401 : 200, headers });
  } catch {
    return NextResponse.json({ userId: null }, { status: 503, headers });
  }
}
