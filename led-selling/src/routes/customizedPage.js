import express from "express";
import { customizedPageController } from "../controllers";

let router = express.Router();

/**
 * Get customizedPage
 */
router.get("/:alias", customizedPageController.getByAlias);

export default router;
