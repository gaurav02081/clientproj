const express = require('express');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories - List all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
});

// POST /api/categories - Create category (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const category = new Category({ name, slug, description });
    await category.save();
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
});

// PUT /api/categories/:id - Update category (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, description },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
});

// DELETE /api/categories/:id - Delete category (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
});

module.exports = router; 