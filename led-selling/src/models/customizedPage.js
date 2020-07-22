import mongoose from "mongoose";
import slugify from "slugify";
import createError from "http-errors";
import { errorMessages } from "../i18n/messages";

let CustomizedPageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  description: String,
  alias: String,
}, {
  autoCreate: true,
  toJSON: {
    transform: (doc, ret, options) => {
      return ret;
    },
  },
  toObject: {
    transform: (doc, ret, options) => {
      return ret;
    },
  },
});

CustomizedPageSchema.pre("save", async function () {
  let alias = slugify(this.path);

  const CustomizedPageSchema = this.constructor;

  let item = await CustomizedPageSchema.findCustomizedPageByAlias(alias);
  if (!!item) {
    throw createError(400, errorMessages.customized_page_alias_existed);
  }

  this.alias = alias;
});

CustomizedPageSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findCustomizedPageById(id) {
    try {
      let objectId = mongoose.Types.ObjectId(id);
      return this.findById(objectId).exec();
    } catch (error) {
      throw createError(400, errorMessages.bad_request);
    }
  },

  findCustomizedPageByAlias(alias) {
    return this.findOne({
      "alias": alias,
    }).exec();
  },

  findByName(keyword) {
    return this.find({
      "name": { "$regex": new RegExp(keyword, "i") },
    }).exec();
  },

  findByDescription(keyword) {
    return this.find({
      "description": { "$regex": new RegExp(model, "i") },
    }).exec();
  },

  updateCustomizedPage(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
};

export default mongoose.model("customized-page", CustomizedPageSchema);
