import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const [rows] = await mysqlPool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "ไม่พบชื่อผู้ใช้" });
    }

    const user = rows[0];
    if (user.password !== password) {
      return NextResponse.json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role ,affiliation: user.Affiliation},
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({
      success: true,
      username: user.username,
      role: user.role,
      Affiliation: user.Affiliation,
      token, 
    });

    response.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 7200,
        sameSite: "lax",
        secure: false, 
      })
    );

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}