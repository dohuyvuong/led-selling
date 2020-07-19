import express from "express";
import { homeController, errorPageController } from "../controllers";

import adminRoute from "./admin";
import productRoute from "./product";
import categoryRoute from "./category";

let router = express.Router();

/**
 * Init all routes
 * @param {express.Express} app from exactly express module
 */
let initRoutes = (app) => {
  router.get("/", homeController.getHomePage);

  router.use("/admin", adminRoute);
  router.use("/product", productRoute);
  router.use("/category", categoryRoute);

  // Error routes
  router.use(errorPageController.getErrorPage);

  return app.use("/", router);
};

export default initRoutes;
