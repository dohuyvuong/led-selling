import express from "express";
import Resize from "../../helper/Resize";
import { errorMessages } from "../../i18n/messages";
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
        error: errorMessages.file_empty,
      });
    }

    let fileInfo = await fileUpload.save(req.file.buffer);

    return res.status(200).json(fileInfo);
  } catch (error) {
    logger.error(error);

    return res.status(500).json(errorMessages.server_error);
  }
};

export {
  uploadImage,
};
