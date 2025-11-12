import pool from "../config/db";

export const getAllTrails = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
