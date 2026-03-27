import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("token", "", {
    path: "/",   // ต้องตรงกับตอน set
    maxAge: 0,   // บังคับหมดอายุ
  });

  return res;
}
