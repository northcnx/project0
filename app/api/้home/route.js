import { NextResponse } from "next/server"
import { mysqlPool } from "@/utils/db"
import jwt from "jsonwebtoken"

export async function GET(req) {
  try {
    // 1. token
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 })
    }

    // 2. decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const affiliation_id = decoded.affiliation

    // 3. รับ year จาก query (?year=2567)
    const { searchParams } = new URL(req.url)
    const year = searchParams.get("year")

    if (!year) {
      return NextResponse.json({ message: "year required" }, { status: 400 })
    }

    // 4. รวมค่า Vol เฉพาะ scope = 1
    const [rows] = await mysqlPool.query(
      `
      SELECT 
        SUM(ui.Vol) AS total_vol
      FROM user_item ui
      JOIN admin_item ai
        ON ui.admin_item_id = ai.id
      WHERE ui.affiliation_id = ?
        AND ui.year = ?
        AND ai.scope = 1
      `,
      [affiliation_id, year]
    )

    return NextResponse.json({
      success: true,
      total: rows[0].total_vol ?? 0,
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
