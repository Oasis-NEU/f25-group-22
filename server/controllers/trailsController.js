import pool from "../config/db";

export const getAllTrails = async (req, res) => {
  try {
    const trails = await pool.query("SELECT * FROM trails");
    if (!trails || trails.rows.length === 0) {
      res.status(200).json({ message: "No trails found" });
    }

    res.status(200).json({ trails: trails.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
