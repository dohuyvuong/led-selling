import express from "express";
import categoryRoute from "./category";
import productRoute from './product';
import uploadRoute from "./upload";

let router = express.Router();

router.use("/category", categoryRoute);
router.use("/product", productRoute);
router.use("/upload", uploadRoute);

export default router;
