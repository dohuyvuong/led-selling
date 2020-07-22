import { CustomizedPageModel } from "../models";
import { errorMessages } from "../i18n/messages";
import logger from "winston";

/**
 * Add new customizedPage
 * @param {Object} customizedPageItem
 */
let add = async (customizedPageItem) => {
  logger.debug("Add new customizedPage with customizedPageItem=%o", customizedPageItem);

  let customizedPage = await CustomizedPageModel.createNew(customizedPageItem);

  return customizedPage;
};

/**
 * Update customizedPage
 * @param {String} id customizedPageId
 * @param {Object} updatingCustomizedPageItem
 */
let update = async (id, updatingCustomizedPageItem) => {
  logger.debug("Update customizedPage with id=%s, updatingCustomizedPageItem=%o", id, updatingCustomizedPageItem);

  let currentCustomizedPage = await CustomizedPageModel.findById(id);

  if (!currentCustomizedPage) {
    throw createError(400, errorMessages.customized_page_not_found);
  }

  return CustomizedPageModel.updateCustomizedPage(id, updatingCustomizedPageItem);
};

/**
 * Find customizedPage
 * @param {String} id customizedPageId
 */
let findById = async (id) => {
  logger.debug("Find customizedPage with id=%s", id);

  let customizedPage = await CustomizedPageModel.findCustomizedPageById(id);

  if (customizedPage) {
    return customizedPage;
  }

  return null;
};

/**
 * Find customizedPage
 * @param {String} alias customizedPageAlias
 */
let findByAlias = async (alias) => {
  logger.debug("Find customizedPage with alias=%s", alias);

  let customizedPage = await CustomizedPageModel.findCustomizedPageByAlias(alias);

  if (!!customizedPage) {
    return customizedPage;
  }

  return null;
};

export const customizedPageService = {
  add,
  update,
  findById,
  findByAlias,
};
