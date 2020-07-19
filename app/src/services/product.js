import { ProductModel } from "../models";
import { errorMessages } from "../i18n/messages";
import logger from "winston";

/**
 * Add new product
 * @param {Object} productItem
 */
let add = async (productItem) => {
  logger.debug("Add new product with productItem=%o", productItem);

  let product = await ProductModel.createNew(productItem);

  return product;
};

/**
 * Update product
 * @param {String} id productId
 * @param {Object} updatingProductItem
 */
let update = async (id, updatingProductItem) => {
  logger.debug("Update product with id=%s, updatingProductItem=%o", id, updatingProductItem);

  let currentProduct = await ProductModel.findById(id);

  if (!currentProduct) {
    throw createError(400, errorMessages.product_not_found);
  }

  return ProductModel.updateProduct(id, updatingProductItem);
};

/**
 * Find product
 * @param {String} id productId
 */
let findById = async (id) => {
  logger.debug("Find product with id=%s", id);

  let product = await ProductModel.findProductById(id);

  if (product) {
    return product;
  }

  return null;
};

/**
 * Find product
 * @param {String} alias productAlias
 */
let findByAlias = async (alias) => {
  logger.debug("Find product with alias=%s", alias);

  let product = await ProductModel.findProductByAlias(alias);

  if (!!product) {
    return product;
  }

  return null;
};

/**
 * Find products by categoryId
 * @param {String} categoryId
 */
let findProductsByCategoryId = async (categoryId) => {
  logger.debug("Find products by categoryId=%s", categoryId);

  return await ProductModel.findProductsByCategoryId(categoryId);
};

export const productService = {
  add,
  update,
  findById,
  findByAlias,
  findProductsByCategoryId,
};
