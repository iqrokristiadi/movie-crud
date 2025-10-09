import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserDashboard } from "../controllers/userController.js";

const router = express.Router();

// Get users dashboard
router.get("/dashboard", protect, getUserDashboard);

export default router;
