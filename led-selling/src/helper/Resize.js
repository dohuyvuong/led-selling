import sharp from "sharp";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

class Resize {
  constructor(folder) {
    this.folder = folder;
  }

  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer, {})
      .resize(1000, 1000, { // size image 1000x1000
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);

    return {
      location: this.folder + "/" + filename,
    };
  }

  static filename() {
     // random file name
    return `${uuid()}.png`;
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
