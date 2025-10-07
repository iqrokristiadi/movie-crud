import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("✅ MongoDB Connected");

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: 123456");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
