import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createActor,
  getActors,
  getActorById,
  updateActor,
  deleteActor,
} from "../controllers/actorController.js";

const router = express.Router();

router.post("/", protect, adminOnly, createActor);
router.get("/", getActors);
router.get("/:id", getActorById);
router.put("/:id", protect, adminOnly, updateActor);
router.delete("/:id", protect, adminOnly, deleteActor);

export default router;
