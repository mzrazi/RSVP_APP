const pool = require("../config/db");

const VALID_STATUSES = ["GOING", "MAYBE", "DECLINED"];

const createOrUpdateRsvp = async (req, res) => {
  try {
    const { meetupId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;
    console.log("RSVP request:", { meetupId, status, userId });

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid RSVP status",
      });
    }

    const [meetups] = await pool.execute(
      "SELECT id FROM meetups WHERE id = ?",
      [meetupId]
    );

    if (meetups.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meetup not found",
      });
    }

    const [existingRsvp] = await pool.execute(
      "SELECT id FROM rsvps WHERE user_id = ? AND meetup_id = ?",
      [userId, meetupId]
    );

    if (existingRsvp.length > 0) {
      await pool.execute(
        "UPDATE rsvps SET status = ? WHERE user_id = ? AND meetup_id = ?",
        [status, userId, meetupId]
      );
    } else {
      await pool.execute(
        `INSERT INTO rsvps (user_id, meetup_id, status)
         VALUES (?, ?, ?)`,
        [userId, meetupId, status]
      );
    }

    const [rows] = await pool.execute(
      `SELECT
        r.id,
        r.user_id,
        r.meetup_id,
        r.status,
        r.created_at,
        r.updated_at
       FROM rsvps r
       WHERE r.user_id = ? AND r.meetup_id = ?`,
      [userId, meetupId]
    );

    return res.status(200).json({
      success: true,
      rsvp: rows[0],
    });
  } catch (error) {
    console.error("RSVP error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAttendees = async (req, res) => {
  try {
    const { meetupId } = req.params;

    const [meetups] = await pool.execute(
      "SELECT id FROM meetups WHERE id = ?",
      [meetupId]
    );

    if (meetups.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meetup not found",
      });
    }

    const [rows] = await pool.execute(
      `SELECT
        u.id,
        u.name,
        u.email,
        r.status
       FROM rsvps r
       JOIN users u ON r.user_id = u.id
       WHERE r.meetup_id = ?
       ORDER BY u.name ASC`,
      [meetupId]
    );

    return res.status(200).json({
      success: true,
      attendees: rows,
    });
  } catch (error) {
    console.error("Get attendees error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createOrUpdateRsvp,
  getAttendees,
};