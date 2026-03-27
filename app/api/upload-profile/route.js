import { writeFile } from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";
import { mysqlPool } from "@/utils/db";

export async function POST(req) {
  try {
    // รับ token จาก cookie หรือ Authorization header
    const cookieToken = req.cookies.get("token")?.value;
    const authHeader = req.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;
    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const formData = await req.formData();
    const file = formData.get("profile");

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `profile_${decoded.id}_${Date.now()}.png`;
    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      fileName
    );

    await writeFile(uploadPath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    // บันทึก path ลง DB
    await mysqlPool.execute(
      "UPDATE users SET profile_image = ? WHERE id = ?",
      [imageUrl, decoded.id]
    );

    return Response.json({
      success: true,
      profile_image: imageUrl,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
