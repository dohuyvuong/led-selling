import { CategoryModel } from "../models";
import { errorMessages } from "../i18n/messages";
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
 */
let findRootCategories = async () => {
  logger.debug("Find root categories");

  return await CategoryModel.findRootCategories();
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
 */
let findSubcategoriesByCategoryId = async (categoryId) => {
  logger.debug("Find subcategories with categoryId=%s", categoryId);

  return await CategoryModel.findSubcategoriesByCategoryId(categoryId);
};

export const categoryService = {
  add,
  update,
  findById,
  findByAlias,
  findRootCategories,
  findLeafCategories,
  findNotLeafCategories,
  findSubcategoriesByCategoryId,
};
