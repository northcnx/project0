import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {

    // 1️⃣ อ่าน token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    // 2️⃣ decode token
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const affiliation_id = decoded.affiliation;

    if (!affiliation_id) {
      return NextResponse.json(
        { message: "affiliation not found" },
        { status: 400 }
      );
    }

    // 3️⃣ รับปีจาก frontend
    const body = await req.json();
    const year = Number(body.year_id); // เช่น 2569

    if (!year) {
      return NextResponse.json(
        { message: "year is required" },
        { status: 400 }
      );
    }

    console.log("year from frontend:", year);

    // 4️⃣ หา id จาก admin_year
    const [yearRows] = await mysqlPool.query(
      "SELECT id FROM admin_year WHERE year = ?",
      [year]
    );

    if (yearRows.length === 0) {
      return NextResponse.json(
        { message: "ไม่พบปีนี้ใน admin_year" },
        { status: 400 }
      );
    }

    const year_id = yearRows[0].id;

    console.log("year_id:", year_id);

    // 5️⃣ สร้าง user_item จาก admin_item
    const sql = `
      INSERT INTO user_item (
        admin_item_id,
        Vol,
        pdf_import,
        create_year,
        affiliation_id,
        year_id
      )
      SELECT
        ai.id,
        0,
        '',
        CURDATE(),
        ?,
        ?
      FROM admin_item ai
      WHERE ai.year_id = ?
    `;

    const [result] = await mysqlPool.query(sql, [
      affiliation_id,
      year_id,
      year_id
    ]);

    console.log("insert result:", result);

    return NextResponse.json({
      success: true,
      inserted: result.affectedRows,
      message: "สร้างรายการตามปีสำเร็จ"
    });

  } catch (err) {

    console.error("userItem POST error:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}