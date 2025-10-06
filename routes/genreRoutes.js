import express from "express";
import {
  createGenre,
  getGenre,
  getGenreById,
  updateGenre,
  deleteGenre,
} from "../controllers/genreController.js";
const router = express.Router();

router.post("/", createGenre);
router.get("/", getGenre);
router.get("/:id", getGenreById);
router.put("/:id", updateGenre);
router.delete("/:id", deleteGenre);

export default router;
