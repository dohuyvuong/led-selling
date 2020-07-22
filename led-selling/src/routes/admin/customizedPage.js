import express from "express";
import { customizedPageController } from "../../controllers";

let router = express.Router();

/**
 * Get customizedPage creation page
 */
router.get("/create", customizedPageController.admin.getCustomizedPageCreationPage);

/**
 * Add customizedPage
 */
router.post("/create", customizedPageController.admin.add);

export default router;
