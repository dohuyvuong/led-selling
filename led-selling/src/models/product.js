import mongoose from "mongoose";
import CategorySchema, { CATEGORY_TYPE } from "./category";
import Breadcrumb from "./breadcrumb";
import shortid from "shortid";
import slugify from "slugify";
import createError from "http-errors";
import { errorMessages } from "../i18n/messages";

let ProductSpecification = new mongoose.Schema({
  title: String,
  value: String,
  type: {
    type: String,
    enum: [ "text", "link" ],
    default: "text",
  }
}, {
  id: false,
  _id: false,
});

let ProductSchema = new mongoose.Schema({
  categoryId: { type: String, required: true },
  name: { type: String, required: true },
  model: String,
  description: String,
  image: String,
  images: [ String ],
  specifications: [ ProductSpecification ],
  alias: String,
  breadcrumb: Breadcrumb,
  shortid: { type: String, default: shortid.generate },
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

ProductSchema.pre("save", async function () {
  let nameAlias = slugify(this.name + " " + (this.model || ""), {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
    locale: "vi",
  });

  let alias = slugify(nameAlias + " " + this.shortid);

  const ProductSchema = this.constructor;

  let item = await ProductSchema.findProductByAlias(alias);
  if (!!item) {
    throw createError(202, errorMessages.product_alias_existed);
  }

  this.alias = alias;

  if (this.categoryId) {
    let category = await CategorySchema.findCategoryById(this.categoryId);
    if (!category) {
      throw createError(400, errorMessages.category_not_found);
    }
    if (category.type == CATEGORY_TYPE.NOT_LEAF_CATEGORY) {
      throw createError(400, errorMessages.product_category_must_be_leaf);
    }
    if (category.type != CATEGORY_TYPE.LEAF_CATEGORY) {
      await CategorySchema.updateCategory(category._id, {
        type: CATEGORY_TYPE.LEAF_CATEGORY,
      });
    }

    this.breadcrumb = {
      categoryId: category._id,
      name: category.name,
      alias: category.alias,
      breadcrumb: category.breadcrumb,
    };
  }
  else {
    throw createError(400, errorMessages.product_category_is_required);
  }
});

ProductSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findProductById(id) {
    try {
      let objectId = mongoose.Types.ObjectId(id);
      return this.findById(objectId).exec();
    } catch (error) {
      throw createError(400, errorMessages.bad_request);
    }
  },

  findProductByAlias(alias) {
    return this.findOne({
      "alias": alias,
    }).exec();
  },

  findProductsByCategoryId(categoryId, offset, limit) {
    return this.find({
      categoryId: categoryId
    }).sort({ "createdAt": -1 }).skip(offset).limit(limit).exec();
  },

  countProductsByCategoryId(categoryId) {
    return this.countDocuments({
      categoryId: categoryId
    }).exec();
  },

  findByModel(keyword) {
    return this.find({
      "model": { "$regex": new RegExp(keyword, "i") },
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

  updateProduct(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
};

export default mongoose.model("product", ProductSchema);
