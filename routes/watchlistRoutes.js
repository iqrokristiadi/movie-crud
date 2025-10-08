import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../controllers/watchlistController.js";

const router = express.Router();

// POST - add
router.post("/:movieId", protect, addToWatchlist);
// DELETE
router.delete("/:movieId", protect, removeFromWatchlist);
// GET
router.get("/", protect, getWatchlist);

export default router;
