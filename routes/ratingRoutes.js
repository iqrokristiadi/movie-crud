import express from "express";
import { rateMovie } from "../controllers/ratingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// user must be logged in to rate
router.post("/:movieId", protect, rateMovie);

export default router;
