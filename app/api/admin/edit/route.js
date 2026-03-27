import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        // ✅ 1. ตรวจ token
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "No token" }, { status: 401 });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        // ✅ 2. รับค่า oldYear และ newYear
        const body = await req.json();
        const oldYear = Number(body.oldYear);
        const newYear = Number(body.newYear);

        if (isNaN(oldYear) || isNaN(newYear)) {
            return NextResponse.json(
                { message: "oldYear และ newYear ต้องเป็นตัวเลข" },
                { status: 400 }
            );
        }

        // 🔍 3. ตรวจสอบว่า newYear ยังไม่มีในระบบ (ห้ามซ้ำ)
        const [dupRows] = await mysqlPool.query(
            `SELECT id FROM admin_year WHERE year = ?`,
            [newYear]
        );

        if (dupRows.length > 0) {
            return NextResponse.json(
                { message: "ปีนี้มีอยู่ในระบบแล้ว" },
                { status: 409 }
            );
        }

        // 🔥 4. อัปเดตปีโดยตรง (FK year_id ไม่เปลี่ยน)
        const [result] = await mysqlPool.query(
            `UPDATE admin_year SET year = ? WHERE year = ?`,
            [newYear, oldYear]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: "ไม่พบปีเก่าในระบบ" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "แก้ไขปีสำเร็จ",
        });

    } catch (err) {
        console.error("ERROR:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}