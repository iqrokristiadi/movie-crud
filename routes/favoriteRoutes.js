import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/:movieId", protect, addToFavorites);
router.get("/", protect, getFavorites);
router.delete("/:movieId", protect, removeFromFavorites);

export default router;
