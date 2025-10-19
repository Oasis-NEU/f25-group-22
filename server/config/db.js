import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool;
try {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });
  console.log("DB connected successfully");
} catch (error) {
  console.error("Error connecting to DB", error);
}

export default pool;
