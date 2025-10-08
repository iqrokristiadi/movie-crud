import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createComment,
  getCommentsByMovie,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Get all comments for a movie
router.get("/:movieId", getCommentsByMovie);

// Post a new comments (only logged in user)
router.post("/:movieId", protect, createComment);

// Delete Comments
router.delete("/:commentId", protect, deleteComment);

// Update Comments
router.put("/:commentId", protect, updateComment);

export default router;
