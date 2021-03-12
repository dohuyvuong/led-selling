import express from "express";
import { categoryService } from "../../services";
import { ejsBuilder } from "../../helper/ejsBuilder";
import { errorMessages } from "../../i18n/messages";
import logger from "winston";
import mongoose from "mongoose";
import createError from "http-errors";
import { labels } from "../../i18n/labels";

/**
 * Get category creation page
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getCategoryCreationPage = async (req, res) => {
  logger.info("Get category creation page");

  try {
    let notLeafCategories = await categoryService.findNotLeafCategories();

    return res.render("admin/category/create/index", {
      ejsBuilder,
      notLeafCategories,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

/**
 * Add new category
 * @param {express.Request} req
 * @param {express.Response} res
 */
let add = async (req, res) => {
  logger.info("Add new category");

  try {
    // Get fields to update from body
    let categoryItem = {
      name: req.body.name,
      description: req.body.description,
      parentId: req.body.parentId || null,
      image: req.body.image,
      thumbImage: req.body.thumbImage,
      images: req.body.images,
      thumbImages: req.body.thumbImages,
    };

    let result = await categoryService.add(categoryItem);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);

    if (error instanceof mongoose.Error) {
      let requiredFields = Object.keys(error.errors)
        .filter(path => error.errors[path].kind == "required")
        .map(path => labels.category_require[path])
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
 * Update category
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let update = async (req, res) => {
  logger.info("Update category");

  try {
    let updatingCategory = Object.assign({ updatedAt: Date.now() }, {
      name: req.body.name,
      description: req.body.description,
      parentId: req.body.parentId,
    });

    // Update category by id
    let result = await categoryService.update(req.body.categoryId, updatingCategory);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export {
  getCategoryCreationPage,
  add,
  update,
};
