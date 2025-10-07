import express from "express";
// Models
import Movie from "../models/movie.js";
// Middleware
import { queryHelper } from "../middlewares/queryHelper.js";
// Controllers
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
router.post("/", createMovie);
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.get("/director/:id", getMovieByDirector);
router.get("/actor/:id", getMovieByActor);
router.get("/genre/:id", getMovieByGenre);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
