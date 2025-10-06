import express from "express";
import { filterMovies } from "../controllers/filterController.js";

const router = express.Router();

// GET /filter?director=Christopher%20Nolan
router.get("/", filterMovies);

export default router;
