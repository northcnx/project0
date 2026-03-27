import jwt from "jsonwebtoken";
import { mysqlPool } from "@/utils/db";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "No token" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await mysqlPool.execute(
      "SELECT firstname, lastname ,Affiliation ,profile_image,role,created_at FROM users WHERE id = ? LIMIT 1",
      [decoded.id]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return Response.json({
      firstname: rows[0].firstname,
      lastname: rows[0].lastname,
      Affiliation: rows[0].Affiliation,
      profile_image: rows[0].profile_image,
      role: rows[0].role,
      created_at: rows[0].created_at,
    });
  } catch (err) {
    console.error("ME API error:", err);
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
}
