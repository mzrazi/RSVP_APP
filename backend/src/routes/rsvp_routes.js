const express = require("express");
const authenticate = require("../middleware/auth_middleware");

const {
  createRsvp,
  updateRsvp,
  getAttendees,
} = require("../controllers/rsvp_controller");

const router = express.Router();

router.post("/:meetupId", authenticate, createRsvp);
router.put("/:meetupId", authenticate, updateRsvp);
router.get("/:meetupId/attendees", authenticate, getAttendees);

module.exports = router;
