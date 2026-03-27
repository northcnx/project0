import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const { user_item_id, file_name } = await req.json();

    if (!user_item_id) {
      return NextResponse.json({ success: false, message: "user_item_id required" }, { status: 400 });
    }

    const [rows] = await mysqlPool.query(
      "SELECT pdf_import FROM user_item WHERE id = ?",
      [user_item_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    const raw = rows[0].pdf_import;
    let fileList = [];
    if (raw) {
      try {
        fileList = JSON.parse(raw);
        if (!Array.isArray(fileList)) fileList = [fileList];
      } catch {
        fileList = [raw];
      }
    }

    if (file_name) {
      // ลบไฟล์เดี่ยวออกจาก array
      const filePath = path.join(process.cwd(), "public/uploads", file_name);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      fileList = fileList.filter(f => f !== file_name);

      const newValue = fileList.length > 0 ? JSON.stringify(fileList) : null;
      await mysqlPool.query(
        "UPDATE user_item SET pdf_import = ? WHERE id = ?",
        [newValue, user_item_id]
      );

      return NextResponse.json({ success: true, files: fileList });
    } else {
      // ลบทุกไฟล์
      for (const f of fileList) {
        const filePath = path.join(process.cwd(), "public/uploads", f);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      await mysqlPool.query(
        "UPDATE user_item SET pdf_import = NULL WHERE id = ?",
        [user_item_id]
      );

      return NextResponse.json({ success: true, files: [] });
    }

  } catch (err) {
    console.error("DELETE FILE ERROR:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
