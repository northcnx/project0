import jwt from "jsonwebtoken";
import { mysqlPool } from "@/utils/db";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await req.json();

    const {
      scope_code,
      scope,
      item_name,
      unit,
      gas_per_unit,
      quantity = 0,
    } = body;

    const total_gas = quantity * gas_per_unit;

    const [result] = await mysqlPool.execute(
      `
      INSERT INTO user_calculations
      (user_id, scope_code, scope, item_name, unit, gas_per_unit, quantity, total_gas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        decoded.id,
        scope_code,
        scope,
        item_name,
        unit,
        gas_per_unit,
        quantity,
        total_gas,
      ]
    );

    return Response.json({
      id: result.insertId,
      message: "Added successfully",
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Add failed" }, { status: 500 });
  }
}
