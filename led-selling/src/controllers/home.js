import express from "express";
import { errorMessages } from "../i18n/messages";
import { ejsBuilder } from "../helper";
import logger from "winston";
import { categoryService } from "../services";
import { DEFAULT_LIMIT } from "../constants";

/**
 * Return Response rendered index page
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getHomePage = async (req, res) => {
  logger.info("Get home page");

  try {
    let rootCategories = await categoryService.findRootCategories();

    let noOfRootCategories = await categoryService.countRootCategories();
    let noOfPages = Math.ceil(noOfRootCategories / DEFAULT_LIMIT.CATEGORY_LIMIT);

    return res.render("home/index", {
      ejsBuilder,
      rootCategories,
      noOfPages,
      route: '/',
    });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export const homeController = {
  getHomePage,
};
