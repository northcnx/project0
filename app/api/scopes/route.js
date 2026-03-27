import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET() {
  const [rows] = await mysqlPool.query(
    "SELECT id, scope,name_tiem FROM admin_g ORDER BY scope ASC"
  );

  return NextResponse.json(rows);
}
