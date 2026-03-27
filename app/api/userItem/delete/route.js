import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // ✅ 1. ตรวจ token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // ✅ 2. รับค่า id
    const body = await req.json();
    const id = Number(body.id);

    // ✅ 3. validate
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "id ต้องเป็นตัวเลข" },
        { status: 400 }
      );
    }

    // 🔍 4. เช็คก่อนว่ามีจริงไหม
    const [rows] = await mysqlPool.query(
      `SELECT id FROM admin_year WHERE year_id = ?`,
      [id]
    );

    console.log("FOUND ROWS:", rows);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลที่ต้องการลบ" },
        { status: 404 }
      );
    }
    // 🔥 5. ลบจริง
    const [result] = await mysqlPool.query(
      `DELETE FROM user_item WHERE year_id = ?`,
      [id]
    );
    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      deletedRows: result.affectedRows,
    });

  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}