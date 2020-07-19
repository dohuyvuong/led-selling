import express from "express";
import { categoryAdminController as admin } from "./admin";
import { categoryService, productService } from "../services";
import { ejsBuilder } from "../helper";
import { errorMessages } from "../i18n/messages";
import logger from "winston";
import { CATEGORY_TYPE } from "../models/category";

/**
 * Return Response rendered category page
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getCategoryPage = async (req, res) => {
  logger.info("Get category page");

  try {
    let rootCategories = await categoryService.findRootCategories();

    return res.render("category/index", {
      ejsBuilder,
      rootCategories,
    });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

/**
 * Get category
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getCategoryPageByAlias = async (req, res) => {
  logger.info("Get category");

  try {
    let alias = req.params.alias;

    let category = await categoryService.findByAlias(alias);

    if (!category) {
      return res.status(400).json(errorMessages.category_not_found);
    }

    let subcategories = [];
    let products = [];

    if (category.type == CATEGORY_TYPE.NOT_LEAF_CATEGORY) {
      subcategories = await categoryService.findSubcategoriesByCategoryId(category._id);
    }
    else if (category.type == CATEGORY_TYPE.LEAF_CATEGORY) {
      products = await productService.findProductsByCategoryId(category._id);
    }

    return res.render("category/category/index", {
      ejsBuilder,
      category,
      subcategories,
      products,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export const categoryController = {
  admin,
  getCategoryPage,
  getCategoryPageByAlias,
};
