import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createDirector,
  getDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
} from "../controllers/directorController.js";

const router = express.Router();

router.post("/", protect, adminOnly, createDirector);
router.get("/", getDirectors);
router.get("/:id", getDirectorById);
router.put("/:id", protect, adminOnly, updateDirector);
router.delete("/:id", protect, adminOnly, deleteDirector);

export default router;
