import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // 1️⃣ ตรวจ token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 2️⃣ รับข้อมูลจาก frontend
    const body = await req.json();
    console.log("Received POST data:", body);

    const yearId = Number(body.year_id);
    if (!yearId || isNaN(yearId)) {
      console.log("Invalid year_id:", yearId);
      return NextResponse.json(
        { message: "year_id ต้องเป็นตัวเลขและไม่ว่าง" },
        { status: 400 }
      );
    }

    // 3️⃣ เช็คข้อมูล user_item ที่เกี่ยวข้อง
    const [relatedUserItems] = await mysqlPool.query(
      `SELECT * FROM user_item WHERE year_id = ?`,
      [yearId]
    );

    console.log("Related user_item rows:", relatedUserItems);

    // 4️⃣ เช็คข้อมูล admin_item ที่เกี่ยวข้อง
    const [relatedAdminItems] = await mysqlPool.query(
      `SELECT ai.* 
       FROM admin_item ai
       JOIN user_item ui ON ui.admin_item_id = ai.id
       WHERE ui.year_id = ?`,
      [yearId]
    );

    console.log("Related admin_item rows:", relatedAdminItems);

    // 5️⃣ ลบจาก admin_year (cascade ลบ user_item)
    const [result] = await mysqlPool.query(
      `DELETE FROM admin_year WHERE id = ?`,
      [yearId]
    );

    console.log("deletedRows:", result.affectedRows);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "ไม่พบปีที่ต้องการลบ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ลบปีและข้อมูลที่เกี่ยวข้องสำเร็จ",
      deletedRows: result.affectedRows,
      relatedUserItems,
      relatedAdminItems,
    });

  } catch (err) {
    console.error("ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}