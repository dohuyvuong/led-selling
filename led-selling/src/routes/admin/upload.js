import express from "express";
import upload from "../../middlewares/upload";
import { uploadController } from "../../controllers/admin";
import { errorMessages } from "../../i18n/messages";
import multer from "multer";

let router = express.Router();

/**
 * Add product image
 */
router.post("/", async (req, res, next) => {
  let uploadHandler = upload.single("image");
  await uploadHandler(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          message: errorMessages.upload_error[error.code],
        });
      }

      return res.status(400).json({
        message: error,
      });
    }

    next();
  });
}, uploadController.uploadImage);

export default router;
