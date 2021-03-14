import sharp from "sharp";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";
import shortid from "shortid";

class Resize {
  constructor(folder) {
    this.folder = folder;
  }

  async save(buffer, originalname) {
    const { filename, thumbFilename } = Resize.filename(originalname);
    const filepath = this.filepath(filename);
    const thumbFilepath = this.filepath(thumbFilename);

    await sharp(buffer, {})
      .resize(1000, 1000, { // size image 1000x1000
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);

    await sharp(buffer, {})
      .resize(500, 500, { // size image 500x500
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .jpeg({ quality: 50, chromaSubsampling: '4:4:4' })
      .toFile(thumbFilepath);

    return {
      location: this.folder + "/" + filename,
      thumbLocation: this.folder + "/" + thumbFilename,
    };
  }

  static filename(originalname) {
    const extensionRegex = /(\.(jpeg|jpg|png))$/i;
    // random file name
    const filename = originalname ? originalname.replace(extensionRegex, `-${shortid.generate()}$1`) : (uuid() + '.png');
    const thumbFilename = filename.replace(extensionRegex, '_thumb$1');
    return { filename, thumbFilename };
  }

  filepath(filename) {
    let publicFolder = path.join(__dirname, "../public");
    let fileFolder = path.join(publicFolder, this.folder);

    if (!fs.existsSync(fileFolder)) {
      fs.mkdirSync(fileFolder, {
        recursive: true,
      });
    }

    return path.resolve(fileFolder, filename);
  }
}

export default Resize;
