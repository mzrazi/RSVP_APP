const pool = require("../config/db");

const VALID_STATUSES = ["GOING", "MAYBE", "DECLINED"];

async function meetupExists(meetupId) {
  const [meetups] = await pool.execute("SELECT id FROM meetups WHERE id = ?", [meetupId]);
  return meetups.length > 0;
}

const createRsvp = async (req, res) => {
  try {
    const { meetupId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid RSVP status" });
    }
    if (!(await meetupExists(meetupId))) {
      return res.status(404).json({ success: false, message: "Meetup not found" });
    }

    const [existingRsvp] = await pool.execute(
      "SELECT id FROM rsvps WHERE user_id = ? AND meetup_id = ?",
      [userId, meetupId],
    );
    if (existingRsvp.length > 0) {
      return res.status(409).json({ success: false, message: "RSVP already exists for this meetup" });
    }

    const [result] = await pool.execute(
      "INSERT INTO rsvps (user_id, meetup_id, status) VALUES (?, ?, ?)",
      [userId, meetupId, status],
    );
    const [rows] = await pool.execute(
      "SELECT id, user_id, meetup_id, status, created_at, updated_at FROM rsvps WHERE id = ?",
      [result.insertId],
    );
    return res.status(201).json({ success: true, rsvp: rows[0] });
  } catch (error) {
    console.error("Create RSVP error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateRsvp = async (req, res) => {
  try {
    const { meetupId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid RSVP status" });
    }
    if (!(await meetupExists(meetupId))) {
      return res.status(404).json({ success: false, message: "Meetup not found" });
    }

    const [existingRsvp] = await pool.execute(
      "SELECT id FROM rsvps WHERE user_id = ? AND meetup_id = ?",
      [userId, meetupId],
    );
    if (existingRsvp.length === 0) {
      return res.status(404).json({ success: false, message: "RSVP not found" });
    }

    await pool.execute("UPDATE rsvps SET status = ? WHERE id = ?", [status, existingRsvp[0].id]);
    const [rows] = await pool.execute(
      "SELECT id, user_id, meetup_id, status, created_at, updated_at FROM rsvps WHERE id = ?",
      [existingRsvp[0].id],
    );
    return res.status(200).json({ success: true, rsvp: rows[0] });
  } catch (error) {
    console.error("Update RSVP error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAttendees = async (req, res) => {
  try {
    const { meetupId } = req.params;
    if (!(await meetupExists(meetupId))) {
      return res.status(404).json({ success: false, message: "Meetup not found" });
    }
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, r.status
       FROM rsvps r JOIN users u ON r.user_id = u.id
       WHERE r.meetup_id = ? ORDER BY u.name ASC`,
      [meetupId],
    );
    return res.status(200).json({ success: true, attendees: rows });
  } catch (error) {
    console.error("Get attendees error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createRsvp, updateRsvp, getAttendees };
