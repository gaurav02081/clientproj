const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering and pagination
 * @access  Public
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['figures', 'posters', 'clothing', 'accessories', 'collectibles', 'books', 'electronics', 'home-decor']),
  query('anime').optional().trim(),
  query('search').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort').optional().custom((value) => {
    const validSorts = ['price', '-price', 'name', '-name', 'createdAt', '-createdAt', 'rating', '-rating'];
    if (value && !validSorts.includes(value)) {
      throw new Error('Invalid sort parameter');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.anime) {
      filter.anime = { $regex: req.query.anime, $options: 'i' };
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Build search query
    let searchQuery = {};
    if (req.query.search) {
      searchQuery = {
        $text: { $search: req.query.search }
      };
    }

    // Combine filters
    const finalFilter = { ...filter, ...searchQuery };

    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      sort = { [req.query.sort.replace('-', '')]: req.query.sort.startsWith('-') ? -1 : 1 };
    }

    const products = await Product.find(finalFilter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('name price originalPrice images category anime stock ratings discount isFeatured');

    const total = await Product.countDocuments(finalFilter);

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .limit(8)
    .select('name price originalPrice images category anime ratings discount');

    res.json(featuredProducts);
  } catch (error) {
    console.error('Featured products fetch error:', error);
    res.status(500).json({ message: 'Server error fetching featured products' });
  }
});

/**
 * @route   GET /api/products/categories
 * @desc    Get all product categories
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

/**
 * @route   GET /api/products/anime
 * @desc    Get all anime names
 * @access  Public
 */
router.get('/anime', async (req, res) => {
  try {
    const anime = await Product.distinct('anime');
    res.json(anime);
  } catch (error) {
    console.error('Anime fetch error:', error);
    res.status(500).json({ message: 'Server error fetching anime' });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(404).json({ message: 'Product not available' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product (Admin only)
 * @access  Private/Admin
 */
router.post('/', protect, admin, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name is required and must be less than 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Product description is required and must be less than 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isArray({ min: 1 })
    .withMessage('At least one category is required'),
  body('category.*')
    .isMongoId()
    .withMessage('Each category must be a valid ID'),
  body('anime')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Anime name is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('sku')
    .trim()
    .isLength({ min: 1 })
    .withMessage('SKU is required'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: req.body.sku });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product (Admin only)
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be less than 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Product description must be less than 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one category is required'),
  body('category.*')
    .isMongoId()
    .withMessage('Each category must be a valid ID'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if SKU is being changed and if it already exists
    if (req.body.sku && req.body.sku !== product.sku) {
      const existingProduct = await Product.findOne({ sku: req.body.sku });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error('Product update error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error updating product' });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router; 