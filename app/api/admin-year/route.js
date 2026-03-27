import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // ดึง token จาก cookie
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token" },
        { status: 401 }
      );
    }

    // ถอดรหัส JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const affiliation_id = decoded.affiliation;

    // query ปีจาก database
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

    return NextResponse.json(rows);

  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}