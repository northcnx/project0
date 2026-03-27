import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function DELETE(req, { params }) {
  const id = Number(params.id);

  if (!id) {
    return NextResponse.json(
      { error: "id ไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const [result] = await mysqlPool.execute(
    "DELETE FROM admin_item WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    return NextResponse.json(
      { error: "ไม่พบข้อมูล" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
