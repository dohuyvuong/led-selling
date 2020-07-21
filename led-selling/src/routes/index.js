import express from "express";
import { homeController } from "../controllers";

import adminRoute from "./admin";
import productRoute from "./product";
import categoryRoute from "./category";

let router = express.Router();

router.get("/", homeController.getHomePage);

router.use("/admin", adminRoute);
router.use("/product", productRoute);
router.use("/category", categoryRoute);

export default router;
