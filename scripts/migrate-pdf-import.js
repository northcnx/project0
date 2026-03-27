// run with: node scripts/migrate-pdf-import.js
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const [rows] = await pool.query("SHOW COLUMNS FROM user_item LIKE 'pdf_import'");
console.log("Current column:", rows[0]);

await pool.query("ALTER TABLE user_item MODIFY COLUMN pdf_import TEXT");
console.log("✅ pdf_import column changed to TEXT successfully");

await pool.end();
