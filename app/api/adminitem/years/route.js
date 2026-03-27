import { NextResponse } from "next/server"
import { mysqlPool } from "@/utils/db"

/* ======================
   GET : ดึงปีทั้งหมด
====================== */
export async function GET() {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT id, year FROM admin_year ORDER BY year DESC"
    )

    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "DB error" },
      { status: 500 }
    )
  }
}

/* ======================
   POST : สร้างปีใหม่
====================== */
export async function POST(req) {
  try {
    const body = await req.json()
    const year = body.year

    if (!year) {
      return NextResponse.json(
        { error: "year required" },
        { status: 400 }
      )
    }

    await mysqlPool.query(
      "INSERT INTO admin_year (year) VALUES (?)",
      [year]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)

    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "year exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "DB error" },
      { status: 500 }
    )
  }
}
