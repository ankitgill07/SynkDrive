import express from "express";
import { searchQuery } from "../controllers/SearchController.js";

const router = express.Router();

router.get("/:query", searchQuery);

export default router;
