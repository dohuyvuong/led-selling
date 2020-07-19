import multer from "multer";
import path from "path";
import { errorMessages } from "../i18n/messages/errorMessages";

const allowedFileTypes = /jpeg|jpg|png/;

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    let isAllowedFileTypes = allowedFileTypes.test(file.mimetype);
    let hasExtName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    if (isAllowedFileTypes && hasExtName) {
      return cb(null, true);
    }

    cb(errorMessages.file_type_not_allowed);
  }
});

module.exports = upload;
