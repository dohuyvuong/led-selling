import express from "express";
import { customizedPageService } from "../../services";
import { ejsBuilder } from "../../helper/ejsBuilder";
import { errorMessages } from "../../i18n/messages";
import logger from "winston";
import mongoose from "mongoose";
import createError from "http-errors";
import { labels } from "../../i18n/labels";

/**
 * Get customizedPage creation page
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getCustomizedPageCreationPage = async (req, res) => {
  logger.info("Get customizedPage creation page");

  try {
    return res.render("admin/customized-page/create/index", {
      ejsBuilder,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

/**
 * Add new customizedPage
 * @param {express.Request} req
 * @param {express.Response} res
 */
let add = async (req, res) => {
  logger.info("Add new customizedPage");

  try {
    let customizedPageItem = {
      name: req.body.name,
      path: req.body.path,
      description: req.body.description,
    };

    let result = await customizedPageService.add(customizedPageItem);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);

    if (error instanceof mongoose.Error) {
      let requiredFields = Object.keys(error.errors)
        .filter(path => error.errors[path].kind == "required")
        .map(path => labels.customized_page_require[path])
        .join(", ");

      return res.status(400).json(errorMessages.require_fields(requiredFields));
    }

    if (error instanceof createError.HttpError) {
      if (error.status == 202) {
        res.status(202).json(error.message);
      }

      return res.status(400).json(error.message);
    }

    return res.status(500).json(errorMessages.server_error);
  }
};

/**
 * Update customizedPage
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let update = async (req, res) => {
  logger.info("Update customizedPage");

  try {
    let updatingCustomizedPage = Object.assign({ updatedAt: Date.now() }, {
      name: req.body.name,
      path: req.body.path,
      description: req.body.description,
    });

    // Update customizedPage by id
    let result = await customizedPageService.update(req.body.customizedPageId, updatingCustomizedPage);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export {
  getCustomizedPageCreationPage,
  add,
  update,
};
