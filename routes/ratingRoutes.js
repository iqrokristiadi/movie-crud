import express from "express";
import {
  rateMovie,
  getUserRateMovies,
} from "../controllers/ratingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// user must be logged in to rate
router.post("/:movieId", protect, rateMovie);
// get all rated movies
router.get("/my-ratings", protect, getUserRateMovies);

export default router;
