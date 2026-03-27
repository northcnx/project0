import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");   // รองรับหลายไฟล์
    const userItemId = formData.get("user_item_id");

    if (!files || files.length === 0 || !userItemId) {
      return NextResponse.json(
        { success: false, message: "invalid data" },
        { status: 400 }
      );
    }

    const userItemIdNum = Number(userItemId);

    // โหลดรายการไฟล์เดิม
    const [existing] = await mysqlPool.query(
      "SELECT pdf_import FROM user_item WHERE id = ?",
      [userItemIdNum]
    );

    let existingFiles = [];
    if (existing.length > 0 && existing[0].pdf_import) {
      try {
        existingFiles = JSON.parse(existing[0].pdf_import);
        if (!Array.isArray(existingFiles)) existingFiles = [existingFiles];
      } catch {
        // backward compat: column เก็บชื่อไฟล์เดี่ยว (ไม่ใช่ JSON)
        existingFiles = [existing[0].pdf_import];
      }
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const newFileNames = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      newFileNames.push(fileName);
    }

    const allFiles = [...existingFiles, ...newFileNames];

    await mysqlPool.query(
      "UPDATE user_item SET pdf_import = ? WHERE id = ?",
      [JSON.stringify(allFiles), userItemIdNum]
    );

    return NextResponse.json({ success: true, files: allFiles });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
