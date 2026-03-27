import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // ===== Token =====
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token" },
        { status: 401 }
      );
    }

    // ===== Decode =====
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const affiliation_id = decoded.affiliation;

    // ===== Query รวม CO2e แยกปี =====
    const [rows] = await mysqlPool.query(
      `
      SELECT 
        ay.year,
        SUM(ui.Vol * IFNULL(ai.AD, 0)) AS total
      FROM user_item ui
      JOIN admin_item ai 
        ON ui.admin_item_id = ai.id
      JOIN admin_year ay
        ON ui.year_id = ay.id
      WHERE ui.affiliation_id = ?
      GROUP BY ay.year
      ORDER BY ay.year
      `,
      [affiliation_id]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}