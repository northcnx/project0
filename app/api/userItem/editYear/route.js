import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // ✅ 1. ตรวจ token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ✅ 2. รับค่า oldYear และ newYear
    const body = await req.json();
    const oldYear = Number(body.oldYear);
    const newYear = Number(body.newYear);

    if (isNaN(oldYear) || isNaN(newYear)) {
      return NextResponse.json(
        { message: "oldYear และ newYear ต้องเป็นตัวเลข" },
        { status: 400 }
      );
    }

    console.log("oldYear:", oldYear, "newYear:", newYear);

    // 🔍 3. Lookup id ของปีเก่า
    const [oldRows] = await mysqlPool.query(
      `SELECT id FROM admin_year WHERE year = ?`,
      [oldYear]
    );

    if (oldRows.length === 0) {
      return NextResponse.json(
        { message: "ไม่พบปีเก่าในระบบ" },
        { status: 404 }
      );
    }

    const oldYearId = oldRows[0].id;

    // 🔍 4. Lookup id ของปีใหม่
    const [newRows] = await mysqlPool.query(
      `SELECT id FROM admin_year WHERE year = ?`,
      [newYear]
    );

    if (newRows.length === 0) {
      return NextResponse.json(
        { message: "ไม่พบปีใหม่ในระบบ" },
        { status: 404 }
      );
    }

    const newYearId = newRows[0].id;

    console.log("oldYearId:", oldYearId, "newYearId:", newYearId);

    // 🔥 5. Update user_item
    const [result] = await mysqlPool.query(
      `UPDATE user_item SET year_id = ? WHERE year_id = ?`,
      [newYearId, oldYearId]
    );

    console.log("affectedRows:", result.affectedRows);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "ไม่มีข้อมูล user_item ที่ตรงกับปีเก่า" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "แก้ไขปีสำเร็จ",
      updatedRows: result.affectedRows
    });

  } catch (err) {
    console.error("ERROR:", err);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}