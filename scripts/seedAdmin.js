// scripts/seedAdmin.js

require("dotenv").config(); // loads MONGO_URI & SECRET_KEY
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/user.model.js");

async function seedAdmin() {
  try {
    // 1) Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to DB");

    // 2) Define admin credentials
    const adminEmail = "admin@example.com"; // change as you like
    const plainPassword = "admin123"; // change as you like

    // 3) Check if admin already exists
    const exists = await User.findOne({ email: adminEmail });
    if (exists) {
      console.log("⚠️ Admin user already exists, skipping creation.");
      process.exit(0);
    }

    // 4) Hash the password
    const hashed = await bcrypt.hash(plainPassword, 8);

    // 5) Create the admin user
    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
    });

    console.log("🎉 Admin user created:", {
      id: admin._id,
      email: admin.email,
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
