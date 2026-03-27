import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function POST(req) {
  const conn = await mysqlPool.getConnection();

  try {
    const { year } = await req.json();
    if (!year) {
      return NextResponse.json({ message: "year required" }, { status: 400 });
    }

    await conn.beginTransaction();

    // 1️⃣ หา id ของปีจาก admin_year
    const [yearRows] = await conn.query(
      `SELECT id FROM admin_year WHERE year = ?`,
      [year]
    );

    if (yearRows.length === 0) {
      await conn.rollback();
      return NextResponse.json({ message: "ไม่พบปีนี้" }, { status: 404 });
    }

    const year_id = yearRows[0].id;

    // 2️⃣ ลบข้อมูล user_item ที่ใช้ year_id นี้
    await conn.query(
      `DELETE FROM user_item WHERE year_id = ?`,
      [year_id]
    );

    // 3️⃣ ลบ admin_item ที่ใช้ year_id นี้
    await conn.query(
      `DELETE FROM admin_item WHERE year_id = ?`,
      [year_id]
    );

    // 4️⃣ ลบปีของ admin
    await conn.query(
      `DELETE FROM admin_year WHERE id = ?`,
      [year_id]
    );

    await conn.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
