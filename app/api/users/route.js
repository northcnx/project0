import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

function verifyToken(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// GET all users
export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await mysqlPool.query(
      `SELECT id, username, password, email, firstname, lastname, Affiliation, role, created_at FROM users ORDER BY created_at DESC`
    );

    return NextResponse.json({ success: true, users: rows });
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST create new user
export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, password, email, firstname, lastname, Affiliation, role } = body;

    if (!username || !password || !firstname || !lastname) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Check duplicate username
    const [existing] = await mysqlPool.query(
      `SELECT id FROM users WHERE username = ?`,
      [username]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว" },
        { status: 409 }
      );
    }

    const [result] = await mysqlPool.query(
      `INSERT INTO users (username, password, email, firstname, lastname, Affiliation, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, password, email ?? null, firstname, lastname, Affiliation ?? 0, role ?? "user"]
    );

    return NextResponse.json({
      success: true,
      message: "เพิ่มผู้ใช้งานสำเร็จ",
      id: result.insertId,
    });
  } catch (err) {
    console.error("POST /api/users error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
