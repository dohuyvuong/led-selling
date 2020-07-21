import express from "express";
import { productController } from "../controllers";

let router = express.Router();

/**
 * Get product
 */
router.get("/:alias", productController.getByAlias);

export default router;
