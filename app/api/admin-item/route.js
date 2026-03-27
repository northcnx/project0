import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// ----------------- POST: เพิ่ม admin_item -----------------
export async function POST(req) {
  const body = await req.json();
  const { year_id, scope, name_tiem, unit, AD } = body;

  if (!year_id || !scope || !name_tiem) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  try {
    // เช็คซ้ำ
    const [rows] = await mysqlPool.execute(
      "SELECT id FROM admin_item WHERE year_id = ? AND scope = ? AND name_tiem = ? LIMIT 1",
      [year_id, scope, name_tiem]
    );

    if (rows.length > 0) {
      return NextResponse.json({ error: "รายการนี้มีอยู่แล้วในขอบเขตนี้" }, { status: 409 });
    }

    // INSERT
    const [result] = await mysqlPool.execute(
      `INSERT INTO admin_item (year_id, scope, name_tiem, unit, AD)
       VALUES (?, ?, ?, ?, ?)`,
      [year_id, scope, name_tiem, unit, AD]
    );

    return NextResponse.json({ id: result.insertId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ----------------- GET: ดึง admin_item -----------------
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const year_id = searchParams.get("year_id");
  const scope = searchParams.get("scope");

  let sql = "SELECT * FROM admin_item WHERE 1=1";
  const params = [];

  if (year_id) {
    sql += " AND year_id = ?";
    params.push(Number(year_id));
  }

  if (scope) {
    sql += " AND scope = ?";
    params.push(Number(scope));
  }

  const [rows] = await mysqlPool.execute(sql, params);
  return NextResponse.json(rows);
}
