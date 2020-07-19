import express from "express";
import { categoryController } from "../../controllers";

let router = express.Router();

/**
 * Get category creation page
 */
router.get("/create", categoryController.admin.getCategoryCreationPage);

/**
 * Add category
 */
router.post("/create", categoryController.admin.add);

module.exports = router;
