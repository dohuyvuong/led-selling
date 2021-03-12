import express from "express";
import { customizedPageAdminController as admin } from "./admin";
import { customizedPageService } from "../services";
import { ejsBuilder } from "../helper/ejsBuilder";
import { errorMessages } from "../i18n/messages";
import logger from "winston";

/**
 * Get customizedPage
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getByAlias = async (req, res, next) => {
  logger.info("Get customizedPage");

  try {
    let alias = req.params.customizedPageAlias;

    let customizedPage = await customizedPageService.findByAlias(alias);

    if (!customizedPage) {
      return next();
    }

    return res.render("customized-page/index", {
      ejsBuilder,
      customizedPage,
      route: `/${alias}`,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export const customizedPageController = {
  admin,
  getByAlias,
};
