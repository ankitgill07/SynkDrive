import express from "express";
import { searchQuery } from "../controllers/searchController.js";

const router = express.Router();

router.get("/:query", searchQuery);

export default router;
