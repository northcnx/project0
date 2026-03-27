import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET all affiliations from affiliation_id table
export async function GET() {
  try {
    const [rows] = await mysqlPool.query(
      `SELECT id, affiliation_item FROM affiliation_id ORDER BY id ASC`
    );
    return NextResponse.json({ success: true, affiliations: rows });
  } catch (err) {
    console.error("GET /api/affiliations error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
