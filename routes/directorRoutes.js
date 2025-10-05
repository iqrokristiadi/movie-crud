import express from "express";
import {
  createDirector,
  getDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
} from "../controllers/directorController.js";

const router = express.Router();

router.post("/", createDirector);
router.get("/", getDirectors);
router.get("/:id", getDirectorById);
router.put("/:id", updateDirector);
router.delete("/:id", deleteDirector);

export default router;
