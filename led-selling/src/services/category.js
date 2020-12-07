import { CategoryModel } from "../models";
import { errorMessages } from "../i18n/messages";
import { DEFAULT_LIMIT } from "../constants";
import createError from "http-errors";
import logger from "winston";

/**
 * Add new category
 * @param {Object} categoryItem
 */
let add = async (categoryItem) => {
  logger.debug("Add new category with categoryItem=%o", categoryItem);

  let category = await CategoryModel.createNew(categoryItem);

  return category;
};

/**
 * Update category
 * @param {String} id categoryId
 * @param {Object} updatingCategoryItem
 */
let update = async (id, updatingCategoryItem) => {
  logger.debug("Update category with id=%s, updatingCategoryItem=%o", id, updatingCategoryItem);

  let currentCategory = await CategoryModel.findById(id);

  if (!currentCategory) {
    throw createError(400, errorMessages.category_not_found);
  }

  return CategoryModel.updateCategory(id, updatingCategoryItem);
};

/**
 * Find category
 * @param {String} id categoryId
 */
let findById = async (id) => {
  logger.debug("Find category with id=%s", id);

  let category = await CategoryModel.findCategoryById(id);

  if (category) {
    return category;
  }

  return null;
};

/**
 * Find category
 * @param {String} alias categoryAlias
 */
let findByAlias = async (alias) => {
  logger.debug("Find category with alias=%s", alias);

  let category = await CategoryModel.findCategoryByAlias(alias);

  if (!!category) {
    return category;
  }

  return null;
};

/**
 * Find root categories
 * @param {Number} offset
 * @param {Number} limit
 */
let findRootCategories = async (offset = 0, limit = DEFAULT_LIMIT.CATEGORY_LIMIT) => {
  logger.debug("Find root categories");

  return await CategoryModel.findRootCategories(offset, limit);
};

/**
 * Count root categories
 */
let countRootCategories = async () => {
  logger.debug("Count root categories");

  return await CategoryModel.countRootCategories();
};

/**
 * Find leaf categories
 */
let findLeafCategories = async () => {
  logger.debug("Find leaf categories");

  return await CategoryModel.findLeafCategories();
};

/**
 * Find not leaf categories
 */
let findNotLeafCategories = async () => {
  logger.debug("Find not leaf categories");

  return await CategoryModel.findNotLeafCategories();
};

/**
 * Find subcategories
 * @param {String} categoryId
 * @param {Number} offset
 * @param {Number} limit
 */
let findSubcategoriesByCategoryId = async (categoryId, offset = 0, limit = DEFAULT_LIMIT.CATEGORY_LIMIT) => {
  logger.debug("Find subcategories with categoryId=%s", categoryId);

  return await CategoryModel.findSubcategoriesByCategoryId(categoryId, offset, limit);
};

/**
 * Count subcategories
 */
let countSubcategoriesByCategoryId = async (categoryId) => {
  logger.debug("Count subcategories with categoryId=%s", categoryId);

  return await CategoryModel.countSubcategoriesByCategoryId(categoryId);
};

export const categoryService = {
  add,
  update,
  findById,
  findByAlias,
  findRootCategories,
  countRootCategories,
  findLeafCategories,
  findNotLeafCategories,
  findSubcategoriesByCategoryId,
  countSubcategoriesByCategoryId,
};
