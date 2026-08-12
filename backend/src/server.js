const express = require("express");
const pool = require("./config/db");
const authRoutes = require("./routes/auth_routes");
const meetupRoutes = require("./routes/meetup_routes");  
const rsvpRoutes = require("./routes/rsvp_routes"); 
require("dotenv").config();
const cors = require("cors");



const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/meetups", meetupRoutes);
app.use("/api/rsvps", rsvpRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      success: true,
      message: "API and database are connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
