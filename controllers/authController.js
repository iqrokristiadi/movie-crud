import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// =============================
// Register (Signup)
// =============================
export const register = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // 2️⃣ Determine role
    //(ADMIN_CODE)
    let role = "user"; //default role
    if (adminCode && adminCode === process.env.ADMIN_CODE) {
      role = "admin";
    }

    // Create user
    const user = await User.create({ name, email, password, role });

    // Create JWT
    const token = generateToken(user);

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================
// Login
// =============================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
