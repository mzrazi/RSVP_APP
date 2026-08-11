const pool = require("../config/db");

const createMeetup = async (req, res) => {
  try {
    const { title, description, location, event_date } = req.body;
    const ownerId = req.user.userId;

    const [result] = await pool.execute(
      `INSERT INTO meetups
       (title, description, location, event_date, owner_id)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, location, event_date, ownerId]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM meetups WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      meetup: rows[0],
    });
  } catch (error) {
    console.error("Create meetup error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMeetups = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        m.id,
        m.title,
        m.description,
        m.location,
        m.event_date,
        m.owner_id,
        u.name AS owner_name,
        m.created_at,
        m.updated_at
      FROM meetups m
      JOIN users u ON m.owner_id = u.id
      ORDER BY m.event_date ASC
    `);

    return res.status(200).json({
      success: true,
      meetups: rows,
    });
  } catch (error) {
    console.error("Get meetups error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMeetupById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT
        m.id,
        m.title,
        m.description,
        m.location,
        m.event_date,
        m.owner_id,
        u.name AS owner_name,
        m.created_at,
        m.updated_at
       FROM meetups m
       JOIN users u ON m.owner_id = u.id
       WHERE m.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meetup not found",
      });
    }

    return res.status(200).json({
      success: true,
      meetup: rows[0],
    });
  } catch (error) {
    console.error("Get meetup error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateMeetup = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, event_date } = req.body;
    const userId = req.user.userId;

    const [result] = await pool.execute(
      `UPDATE meetups
       SET title = ?, description = ?, location = ?, event_date = ?
       WHERE id = ? AND owner_id = ?`,
      [title, description, location, event_date, id, userId]
    );

    if (result.affectedRows === 0) {
      const [meetup] = await pool.execute(
        "SELECT id FROM meetups WHERE id = ?",
        [id]
      );

      if (meetup.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Meetup not found",
        });
      }

      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this meetup",
      });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM meetups WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      meetup: rows[0],
    });
  } catch (error) {
    console.error("Update meetup error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteMeetup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const [result] = await pool.execute(
      "DELETE FROM meetups WHERE id = ? AND owner_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      const [meetup] = await pool.execute(
        "SELECT id FROM meetups WHERE id = ?",
        [id]
      );

      if (meetup.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Meetup not found",
        });
      }

      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this meetup",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Delete meetup error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createMeetup,
  getMeetups,
  getMeetupById,
  updateMeetup,
  deleteMeetup,
};