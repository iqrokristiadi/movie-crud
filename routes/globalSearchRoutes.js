import express from "express";
import { globalSearch } from "../controllers/globalSearchController.js";

const router = express.Router();

// GET /search?keyword=xxx
router.get("/", globalSearch);

export default router;
