import { NextResponse } from "next/server"
import { mysqlPool } from "@/utils/db"
import jwt from "jsonwebtoken"

export async function POST(req) {
  let conn

  try {
    // 1. ตรวจ token
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 🔒 แนะนำ: admin เท่านั้น
    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // 2. รับค่า
    const { oldYear, newYear } = await req.json()
    if (!oldYear || !newYear) {
      return NextResponse.json(
        { message: "oldYear & newYear required" },
        { status: 400 }
      )
    }

    // 3. เริ่ม transaction
    conn = await mysqlPool.getConnection()
    await conn.beginTransaction()

    // 4. update admin_item (ทุก affiliation)
    const [adminResult] = await conn.query(
      `
      UPDATE admin_item
      SET year = ?
      WHERE year = ?
      `,
      [newYear, oldYear]
    )

    // 5. update user_item (ทุก affiliation)
    const [userResult] = await conn.query(
      `
      UPDATE user_item
      SET year = ?
      WHERE year = ?
      `,
      [newYear, oldYear]
    )

    // 6. commit
    await conn.commit()

    return NextResponse.json({
      success: true,
      adminUpdated: adminResult.affectedRows,
      userUpdated: userResult.affectedRows,
    })

  } catch (err) {
    if (conn) await conn.rollback()
    console.error(err)
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  } finally {
    if (conn) conn.release()
  }
}
