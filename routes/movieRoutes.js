import express from "express";
// Models
import Movie from "../models/movie.js";
// Middleware
import { queryHelper } from "../middlewares/queryHelper.js";
// Controllers
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createMovie,
  getMovies,
  getMovieById,
  getMovieByDirector,
  getMovieByActor,
  getMovieByGenre,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/advanced", queryHelper(Movie, ["director", "actors", "genre"]));
// Protected route (only logged-in users)
router.post("/", protect, adminOnly, createMovie);
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.get("/director/:id", getMovieByDirector);
router.get("/actor/:id", getMovieByActor);
router.get("/genre/:id", getMovieByGenre);
// Admin-only routes
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;
