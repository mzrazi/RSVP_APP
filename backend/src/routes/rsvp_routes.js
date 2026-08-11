const express = require("express");
const authenticate = require("../middleware/auth_middleware");

const {
  createOrUpdateRsvp,
  getAttendees,
} = require("../controllers/rsvp_controller");

const router = express.Router();

router.post("/:meetupId", authenticate, createOrUpdateRsvp);
router.get("/:meetupId/attendees", authenticate, getAttendees);

module.exports = router;