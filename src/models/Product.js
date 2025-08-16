const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String },   // size / material, etc.
  value: { type: String }   // 2.4, Steel, etc.
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  sku: { type: String, unique: true, sparse: true },
  description: String,
  category: { type: String, index: true },
  tags: [String],
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  variants: [variantSchema],
  weight: { type: Number, default: 0 }, // in grams
  popularity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
