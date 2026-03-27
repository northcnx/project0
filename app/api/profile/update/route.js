import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

function verifyToken(req) {
  // Try cookie first
  const cookieToken = req.cookies.get("token")?.value;
  if (cookieToken) {
    try { return jwt.verify(cookieToken, process.env.JWT_SECRET); } catch {}
  }
  // Fallback: Authorization header
  const auth = req.headers.get("authorization") || "";
  const bearerToken = auth.replace("Bearer ", "").trim();
  if (bearerToken) {
    try { return jwt.verify(bearerToken, process.env.JWT_SECRET); } catch {}
  }
  return null;
}

// PUT /api/profile/update — update own profile (name, email, password)
export async function PUT(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { firstname, lastname, email, password } = await req.json();

    if (!firstname || !lastname) {
      return NextResponse.json({ message: "กรุณากรอกชื่อและนามสกุล" }, { status: 400 });
    }

    if (password && password.trim() !== "") {
      await mysqlPool.query(
        `UPDATE users SET firstname=?, lastname=?, email=?, password=? WHERE id=?`,
        [firstname, lastname, email ?? null, password, decoded.id]
      );
    } else {
      await mysqlPool.query(
        `UPDATE users SET firstname=?, lastname=?, email=? WHERE id=?`,
        [firstname, lastname, email ?? null, decoded.id]
      );
    }

    return NextResponse.json({ success: true, message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (err) {
    console.error("PUT /api/profile/update error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET /api/profile/update — fetch own full profile (including email)
export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await mysqlPool.query(
      `SELECT firstname, lastname, email, Affiliation, profile_image FROM users WHERE id = ? LIMIT 1`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้งาน" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("GET /api/profile/update error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
