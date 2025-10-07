import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createGenre,
  getGenre,
  getGenreById,
  updateGenre,
  deleteGenre,
} from "../controllers/genreController.js";
const router = express.Router();

router.post("/", protect, adminOnly, createGenre);
router.get("/", getGenre);
router.get("/:id", getGenreById);
router.put("/:id", protect, adminOnly, updateGenre);
router.delete("/:id", protect, adminOnly, deleteGenre);

export default router;
