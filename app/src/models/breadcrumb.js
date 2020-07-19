import mongoose from "mongoose";

let BreadcrumbSchema = new mongoose.Schema({
  categoryId: { type: String, required: true },
  name: String,
  alias: String,
}, {
  id: false,
  _id: false,
});
BreadcrumbSchema.add({ breadcrumb: BreadcrumbSchema });

module.exports = BreadcrumbSchema;
