import express from "express";
import { productAdminController as admin } from "./admin";
import { productService } from "../services";
import { ejsBuilder } from "../helper/ejsBuilder";
import { errorMessages } from "../i18n/messages";
import logger from "winston";

/**
 * Get product
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getByAlias = async (req, res) => {
  logger.info("Get product");

  try {
    let alias = req.params.alias;

    let product = await productService.findByAlias(alias);

    if (!product) {
      return res.status(400).json(errorMessages.product_not_found);
    }

    return res.render("product/index", {
      ejsBuilder,
      product,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export const productController = {
  admin,
  getByAlias,
};
