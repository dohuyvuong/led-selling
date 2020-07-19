import express from "express";
import expressLayouts from "express-ejs-layouts";

/**
 * Config view engine for app
 * @param {express.Express} app from exactly express module
 */
let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
  app.use(expressLayouts);
  app.set('layout', 'template');
  app.set("layout extractStyles", true)
  app.set("layout extractScripts", true)
};

export default configViewEngine;
