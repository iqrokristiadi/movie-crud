import express from "express";
import {
  createActor,
  getActors,
  getActorById,
  updateActor,
  deleteActor,
} from "../controllers/actorController.js";

const router = express.Router();

router.post("/", createActor);
router.get("/", getActors);
router.get("/:id", getActorById);
router.put("/:id", updateActor);
router.delete("/:id", deleteActor);

export default router;
