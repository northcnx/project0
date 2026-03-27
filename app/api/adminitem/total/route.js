import { NextResponse } from "next/server"
import { mysqlPool } from "@/utils/db"
import jwt from "jsonwebtoken"

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const affiliation_id = decoded.affiliation

    const [rows] = await mysqlPool.query(
      `
      SELECT year, SUM(AD) AS total
      FROM admin_item
      WHERE affiliation_id = ?
      GROUP BY year
      `,
      [affiliation_id]
    )

    return NextResponse.json({
      success: true,
      data: rows,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
  