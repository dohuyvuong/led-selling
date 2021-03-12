import express from "express";
import { errorPageController, homeController } from "../controllers";
import { customizedPageController } from "../controllers";

import adminRoute from "./admin";
import productRoute from "./product";
import customizedPageRoute from "./customizedPage";
import categoryRoute from "./category";

let router = express.Router();

router.get("/", homeController.getHomePage);

router.use("/admin", adminRoute);
router.use("/product", productRoute);
router.use("/customized-page", customizedPageRoute);
router.use("/category", categoryRoute);

router.get("/:customizedPageAlias", customizedPageController.getByAlias);

// Handle error get-routes
router.get(/.*/, errorPageController.getErrorPage)

export default router;
