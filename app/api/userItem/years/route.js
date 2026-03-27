import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // ===== 1. อ่าน Token จาก Cookie =====
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token" },
        { status: 401 }
      );
    }

    // ===== 2. Decode Token =====
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const affiliation_id = decoded.affiliation;

    // ===== 3. Query Database =====
    const [rows] = await mysqlPool.query(
      `
      SELECT DISTINCT ay.id, ay.year
      FROM user_item ui
      JOIN admin_year ay ON ui.year_id = ay.id
      WHERE ui.affiliation_id = ?
      ORDER BY ay.year DESC
      `,
      [affiliation_id]
    );

    // ===== 4. ส่งข้อมูลกลับ Frontend =====
    return NextResponse.json(rows);

  } catch (error) {

    console.error("API ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}