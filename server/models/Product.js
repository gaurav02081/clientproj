const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    // help_text: 'Reference to one or more categories',
    // verbose_name: 'Category'
  }],
  anime: {
    type: String,
    required: [true, 'Anime name is required'],
    trim: true
  },
  images: [{
    type: String,
    required: [true, 'At least one product image is required']
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    material: { type: String, trim: true },
    dimensions: { type: String, trim: true },
    weight: { type: String, trim: true },
    brand: { type: String, trim: true }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  shipping: {
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  anime: 'text',
  tags: 'text'
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

// Method to update average rating
productSchema.methods.updateRating = function(newRating) {
  const totalRating = this.ratings.average * this.ratings.count + newRating;
  this.ratings.count += 1;
  this.ratings.average = totalRating / this.ratings.count;
  return this.save();
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema); 