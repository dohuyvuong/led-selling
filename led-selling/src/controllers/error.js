import express from "express";
import { errorMessages } from "../i18n/messages";
import logger from "winston";

/**
 * Get error page
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getErrorPage = async (req, res) => {
  logger.info("Get error page");

  try {
    return res.render("error/index");
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export const errorPageController = {
  getErrorPage,
};
