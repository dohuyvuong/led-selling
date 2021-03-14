import multer from "multer";
import { errorMessages } from "../i18n/messages/errorMessages";

const mineTypesRegex = /jpeg|jpg|png/;
const extensionsRegex = /\.(jpeg|jpg|png)$/i;

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    let isAllowedFileTypes = mineTypesRegex.test(file.mimetype);
    let hasExtName = extensionsRegex.test(file.originalname);

    if (isAllowedFileTypes && hasExtName) {
      return cb(null, true);
    }

    cb(errorMessages.file_type_not_allowed);
  }
});

export default upload;
