const mongoose = require('mongoose');

/**
 * Category model for product categorization
 * @help_text: Used to organize products into sections
 * @verbose_name: Category
 */
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Category name is required
    unique: true, // No duplicate category names
    trim: true,
    // help_text: 'Name of the category',
    // verbose_name: 'Category Name'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // help_text: 'URL-friendly identifier',
    // verbose_name: 'Slug'
  },
  description: {
    type: String,
    trim: true,
    // help_text: 'Optional description of the category',
    // verbose_name: 'Description'
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema); 