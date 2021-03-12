import mongoose from "mongoose";
import Breadcrumb from "./breadcrumb";
import slugify from "slugify";
import createError from "http-errors";
import { errorMessages } from "../i18n/messages";

export const CATEGORY_TYPE = {
  UNDEFINED: "UNDEFINED",
  LEAF_CATEGORY: "LEAF_CATEGORY",
  NOT_LEAF_CATEGORY: "NOT_LEAF_CATEGORY",
};

let CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  thumbImage: String,
  images: [ String ],
  thumbImages: [ String ],
  parentId: String,
  alias: String,
  type: {
    type: String,
    enum: [
      CATEGORY_TYPE.UNDEFINED,
      CATEGORY_TYPE.LEAF_CATEGORY,
      CATEGORY_TYPE.NOT_LEAF_CATEGORY,
    ],
    default: CATEGORY_TYPE.UNDEFINED,
  },
  breadcrumb: Breadcrumb,
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
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

CategorySchema.pre("save", async function () {
  let alias = slugify(this.name, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
    locale: "vi",
  });

  const CategorySchema = this.constructor;

  let item = await CategorySchema.findCategoryByAlias(alias);
  if (!!item) {
    throw createError(400, errorMessages.category_alias_existed);
  }

  this.alias = alias;

  if (this.parentId) {
    let parentCategory = await CategorySchema.findCategoryById(this.parentId);
    if (!parentCategory) {
      throw createError(400, errorMessages.category_not_found);
    }
    if (parentCategory.type == CATEGORY_TYPE.LEAF_CATEGORY) {
      throw createError(400, errorMessages.category_parent_must_not_be_leaf);
    }
    if (parentCategory.type != CATEGORY_TYPE.NOT_LEAF_CATEGORY) {
      await CategorySchema.updateCategory(parentCategory._id, {
        type: CATEGORY_TYPE.NOT_LEAF_CATEGORY,
      });
    }

    this.breadcrumb = {
      categoryId: parentCategory._id,
      name: parentCategory.name,
      alias: parentCategory.alias,
      breadcrumb: parentCategory.breadcrumb,
    };
  }
  else {
    this.parentId = null;
  }
});

CategorySchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findCategoryById(id) {
    try {
      let objectId = mongoose.Types.ObjectId(id);
      return this.findById(objectId).exec();
    } catch (error) {
      throw createError(400, errorMessages.bad_request);
    }
  },

  findCategoryByAlias(alias) {
    return this.findOne({
      "alias": alias,
    }).exec();
  },

  findRootCategories(offset, limit) {
    return this.find({
      $or: [
        { parentId: { $exists: false } },
        { parentId: { $eq: null } },
        { parentId: { $eq: "" } },
      ],
    }).sort({ "createdAt": -1 }).skip(offset).limit(limit).exec();
  },

  countRootCategories() {
    return this.countDocuments({
      $or: [
        { parentId: { $exists: false } },
        { parentId: { $eq: null } },
        { parentId: { $eq: "" } },
      ],
    }).exec();
  },

  findLeafCategories() {
    return this.find({
      type: {
        "$ne": CATEGORY_TYPE.NOT_LEAF_CATEGORY,
      },
    }).exec();
  },

  findNotLeafCategories() {
    return this.find({
      type: {
        "$ne": CATEGORY_TYPE.LEAF_CATEGORY,
      },
    }).exec();
  },

  findSubcategoriesByCategoryId(id, offset, limit) {
    return this.find({
      "breadcrumb.categoryId": id.toString(),
    }).sort({ "createdAt": -1 }).skip(offset).limit(limit).exec();
  },

  countSubcategoriesByCategoryId(id) {
    return this.countDocuments({
      "breadcrumb.categoryId": id.toString(),
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

  updateCategory(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
};

export default mongoose.model("category", CategorySchema);
