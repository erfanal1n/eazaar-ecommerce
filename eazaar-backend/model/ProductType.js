const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;

const productTypeSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide a product type name"],
    maxLength: 100,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    maxLength: 500,
  },
  icon: {
    type: String,
    required: false,
    validate: [validator.isURL, "Please provide valid icon URL"]
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  categories: [{
    type: ObjectId,
    ref: "Category"
  }],
  products: [{
    type: ObjectId,
    ref: "Products"
  }],
}, {
  timestamps: true
});

// Pre-save middleware to generate slug from name
productTypeSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

const ProductType = mongoose.model("ProductType", productTypeSchema);

module.exports = ProductType;