const express = require("express");
const authenticate = require("../middleware/auth_middleware");

const {
  createMeetup,
  getMeetups,
  getMeetupById,
  updateMeetup,
  deleteMeetup,
} = require("../controllers/meetup_controller");

const router = express.Router();

router.get("/", getMeetups);
router.get("/:id", getMeetupById);

router.post("/", authenticate, createMeetup);
router.put("/:id", authenticate, updateMeetup);
router.delete("/:id", authenticate, deleteMeetup);

module.exports = router;