import express from "express";
import { productService, categoryService } from "../../services";
import { ejsBuilder } from "../../helper/ejsBuilder";
import { errorMessages } from "../../i18n/messages";
import logger from "winston";
import mongoose from "mongoose";
import createError from "http-errors";
import { labels } from "../../i18n/labels";
import lodash from "lodash";

/**
 * Get product creation page
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getProductCreationPage = async (req, res) => {
  logger.info("Get product creation page");

  try {
    let leafCategories = await categoryService.findLeafCategories();

    return res.render("admin/product/create/index", {
      ejsBuilder,
      leafCategories,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

/**
 * Add new product
 * @param {express.Request} req
 * @param {express.Response} res
 */
let add = async (req, res) => {
  logger.info("Add new product");

  try {
    // Get fields to update from body
    let specifications = req.body.specification_title
        && req.body.specification_title
            .map((title, index) => {
              if (title && req.body.specification_type[index] && req.body.specification_value[index]) {
                return {
                  title: title,
                  value: req.body.specification_value[index],
                  type: req.body.specification_type[index],
                };
              }
            })
            .filter(specification => specification);

    specifications = lodash.uniqBy(specifications, "title");

    let productItem = {
      categoryId: req.body.categoryId,
      name: req.body.name,
      model: req.body.model,
      description: req.body.description,
      image: req.body.image,
      thumbImage: req.body.thumbImage,
      images: req.body.images,
      thumbImages: req.body.thumbImages,
      specifications: specifications,
    };

    let result = await productService.add(productItem);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);

    if (error instanceof mongoose.Error) {
      let requiredFields = Object.keys(error.errors)
        .filter(path => error.errors[path].kind == "required")
        .map(path => labels.product_require[path])
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
 * Update product
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let update = async (req, res) => {
  logger.info("Update product");

  try {
    let updatingProduct = Object.assign({ updatedAt: Date.now() }, {
      categoryId: req.body.categoryId,
      model: req.body.model,
      name: req.body.name,
      description: req.body.description,
      powerCons: req.body.powerCons, // Cong suat tieu thu (Watts)
      brand: req.body.brand, // Hang
      lumen: req.body.lumen, // Quang thong
      colorTemp: req.body.colorTemp, // Nhiet do mau anh sang
      dimensions: req.body.dimensions, // Kich thuoc
      inputPower: req.body.inputPower, // Dien ap ngo vao
      cri: req.body.cri, // Chi so hoan mau
      angle: req.body.angle, // Goc chieu sang
      ip: req.body.ip, // Tieu chuan bao ve
      warranty: req.body.warranty, // Thoi gian bao hanh (Years)
      lifeTime: req.body.lifeTime, // Tuoi tho (Hours)
    });

    // Update product by id
    let result = await productService.update(req.body.productId, updatingProduct);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export {
  getProductCreationPage,
  add,
  update,
};
