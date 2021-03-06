import express from "express";
import { categoryAdminController as admin } from "./admin";
import { categoryService, productService } from "../services";
import { ejsBuilder } from "../helper";
import { errorMessages } from "../i18n/messages";
import logger from "winston";
import { CATEGORY_TYPE } from "../models/category";
import { DEFAULT_LIMIT } from "../constants";

/**
 * Return Response rendered category page
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getCategoryPage = async (req, res) => {
  logger.info("Get category page");

  try {
    let rootCategories = await categoryService.findRootCategories();

    let noOfRootCategories = await categoryService.countRootCategories();
    let noOfPages = Math.ceil(noOfRootCategories / DEFAULT_LIMIT.CATEGORY_LIMIT);

    return res.render("category/index", {
      ejsBuilder,
      rootCategories,
      noOfPages,
      route: '/category',
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
    let noOfPages;

    if (category.type == CATEGORY_TYPE.NOT_LEAF_CATEGORY) {
      subcategories = await categoryService.findSubcategoriesByCategoryId(category._id);

      let noOfRootCategories = await categoryService.countSubcategoriesByCategoryId(category._id);
      noOfPages = Math.ceil(noOfRootCategories / DEFAULT_LIMIT.CATEGORY_LIMIT);
    }
    else if (category.type == CATEGORY_TYPE.LEAF_CATEGORY) {
      products = await productService.findProductsByCategoryId(category._id);

      let noOfProductsByCategoryId = await productService.countProductsByCategoryId(category._id);
      noOfPages = noOfProductsByCategoryId / DEFAULT_LIMIT.CATEGORY_LIMIT + 1;
    }

    return res.render("category/category/index", {
      ejsBuilder,
      category,
      subcategories,
      products,
      noOfPages,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

/**
 * Get category
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getRootCategories = async (req, res) => {
  logger.info("Get root categories");

  try {
    let page = +req.query.page;
    let offset, limit;

    page = isNaN(page) ? undefined : page;

    if (page >= 1) {
      offset = (page - 1) * DEFAULT_LIMIT.CATEGORY_LIMIT;
      limit = DEFAULT_LIMIT.CATEGORY_LIMIT;
    }

    let rootCategories = await categoryService.findRootCategories(offset, limit);

    let noOfRootCategories = await categoryService.countRootCategories();
    let noOfPages = Math.ceil(noOfRootCategories / DEFAULT_LIMIT.CATEGORY_LIMIT);

    return res.json({
      rootCategories,
      noOfPages,
    });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

/**
 * Get sub categories or products by category alias
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getSubcategoriesOrProductsPageByCategoryAlias = async (req, res) => {
  logger.info("Get category");

  try {
    let page = +req.query.page;
    let offset, limit;

    page = isNaN(page) ? undefined : page;

    if (page >= 1) {
      offset = (page - 1) * DEFAULT_LIMIT.CATEGORY_LIMIT;
      limit = DEFAULT_LIMIT.CATEGORY_LIMIT;
    }

    let alias = req.params.alias;

    let category = await categoryService.findByAlias(alias);

    if (!category) {
      return res.status(400).json(errorMessages.category_not_found);
    }

    let subcategories = [];
    let products = [];

    if (category.type == CATEGORY_TYPE.NOT_LEAF_CATEGORY) {
      subcategories = await categoryService.findSubcategoriesByCategoryId(category._id, offset, limit);
    }
    else if (category.type == CATEGORY_TYPE.LEAF_CATEGORY) {
      products = await productService.findProductsByCategoryId(category._id, offset, limit);
    }

    return res.json({
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
  getRootCategories,
  getSubcategoriesOrProductsPageByCategoryAlias,
};
