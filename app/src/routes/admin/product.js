import express from "express";
import { productController } from "../../controllers";

let router = express.Router();

/**
 * Get product creation page
 */
router.get("/create", productController.admin.getProductCreationPage);

/**
 * Add product
 */
router.post("/create", productController.admin.add);

module.exports = router;
