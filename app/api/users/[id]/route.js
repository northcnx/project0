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

// PUT update a user by id
export async function PUT(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const { username, password, email, firstname, lastname, Affiliation, role } = body;

    if (!username || !firstname || !lastname) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Check duplicate username (exclude self)
    const [existing] = await mysqlPool.query(
      `SELECT id FROM users WHERE username = ? AND id != ?`,
      [username, userId]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว" },
        { status: 409 }
      );
    }

    // Only update password if a new one was provided
    if (password && password.trim() !== "") {
      await mysqlPool.query(
        `UPDATE users SET username=?, password=?, email=?, firstname=?, lastname=?, Affiliation=?, role=? WHERE id=?`,
        [username, password, email ?? null, firstname, lastname, Affiliation ?? 0, role ?? "user", userId]
      );
    } else {
      await mysqlPool.query(
        `UPDATE users SET username=?, email=?, firstname=?, lastname=?, Affiliation=?, role=? WHERE id=?`,
        [username, email ?? null, firstname, lastname, Affiliation ?? 0, role ?? "user", userId]
      );
    }

    return NextResponse.json({ success: true, message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (err) {
    console.error("PUT /api/users/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE a user by id
export async function DELETE(req, { params }) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    if (decoded.id === userId) {
      return NextResponse.json(
        { message: "ไม่สามารถลบบัญชีของตัวเองได้" },
        { status: 403 }
      );
    }

    const [result] = await mysqlPool.query(
      `DELETE FROM users WHERE id = ?`,
      [userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้งาน" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "ลบผู้ใช้งานสำเร็จ" });
  } catch (err) {
    console.error("DELETE /api/users/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
