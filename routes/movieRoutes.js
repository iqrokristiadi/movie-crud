import express from "express";

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

router.post("/", createMovie);
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.get("/director/:id", getMovieByDirector);
router.get("/actor/:id", getMovieByActor);
router.get("/genre/:id", getMovieByGenre);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
