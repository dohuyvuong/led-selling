import express from "express";
import Resize from "../../helper/Resize";
import { errorMessages } from "../../i18n/messages";
import path from "path";
import fs from "fs";
import logger from "winston";

/**
 * Upload image
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let uploadImage = async (req, res) => {
  logger.info("Upload image");

  try {
    let imagePath = "/upload/images";

    let fileUpload = new Resize(imagePath);

    if (!req.file) {
      return res.status(400).json({
        message: errorMessages.file_empty,
      });
    }

    let fileInfo = await fileUpload.save(req.file.buffer, req.file.originalname);

    return res.status(200).json(fileInfo);
  } catch (error) {
    logger.error(error);

    if (`${error}`.includes('unsupported image format')) {
      return res.status(400).json({
        message: errorMessages.unsupported_image_format,
      });
    }

    return res.status(500).json(errorMessages.server_error);
  }
};

/**
 * Delete images
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let deleteImages = async (req, res) => {
  logger.info("Delete images");

  try {
    let urls = req.query.url;
    if (!Array.isArray(urls)) {
      urls = [ urls ];
    }

    let publicFolder = path.join(__dirname, "../../public");

    const extensionRegex = /(\.(jpeg|jpg|png))$/i;

    urls.forEach(url => {
      const thumbUrl = url.replace(extensionRegex, '_thumb$1');

      if (fs.existsSync(path.join(publicFolder, url))) {
        fs.unlink(path.join(publicFolder, url), () => {});
      }
      if (fs.existsSync(path.join(publicFolder, thumbUrl))) {
        fs.unlink(path.join(publicFolder, thumbUrl), () => {});
      }
    });

    return res.status(200).end();
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export {
  uploadImage,
  deleteImages,
};
