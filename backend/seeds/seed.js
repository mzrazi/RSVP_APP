const bcrypt = require("bcryptjs");
const pool = require("../src/config/db");

const users = [
  {
    name: "Raju",
    email: "raju@example.com",
    password: "password123",
  },
  {
    name: "Ahmed",
    email: "ahmed@example.com",
    password: "password123",
  },
  {
    name: "Sara",
    email: "sara@example.com",
    password: "password123",
  },
];

async function seedUsers() {
  try {
    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, 12);

      await pool.execute(
        `INSERT INTO users (name, email, password_hash)
         VALUES (?, ?, ?)`,
        [user.name, user.email, passwordHash]
      );
    }

    console.log("Users seeded successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await pool.end();
  }
}

seedUsers();