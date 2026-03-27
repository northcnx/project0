import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "No token" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "no items" },
        { status: 400 }
      );
    }

    const conn = await mysqlPool.getConnection();
    try {
      await conn.beginTransaction();

      for (const item of items) {
        await conn.query(
          `UPDATE user_item SET Vol = ? WHERE id = ?`,
          [item.Vol, item.id]
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
