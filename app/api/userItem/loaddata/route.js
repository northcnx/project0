import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // 1. token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    // 2. decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const affiliation_id = decoded.affiliation;

    // 3. รับ year
    const { year } = await req.json();
    if (!year) {
      return NextResponse.json({ message: "year required" }, { status: 400 });
    }

    // 4. query
    const [rows] = await mysqlPool.query(
      `
      SELECT
        ui.id,
        ui.admin_item_id,
        ui.Vol,
        ui.pdf_import,
        ay.year,
        ai.scope,
        ai.name_tiem,
        ai.unit,
        ai.AD
      FROM user_item ui
      JOIN admin_item ai
        ON ui.admin_item_id = ai.id
      JOIN admin_year ay
        ON ui.year_id = ay.id
      WHERE ui.affiliation_id = ?
        AND ay.year = ?
      ORDER BY ai.scope, ai.id
      `,
      [affiliation_id, year]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}