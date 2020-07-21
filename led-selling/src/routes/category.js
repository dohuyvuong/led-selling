import express from "express";
import { categoryController } from "../controllers";

let router = express.Router();

/**
 * Get category
 */
router.get("/", categoryController.getCategoryPage);

/**
 * Get category
 */
router.get("/:alias", categoryController.getCategoryPageByAlias);

export default router;
