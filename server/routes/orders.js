const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin, customer } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', protect, customer, [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  body('shippingAddress.firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  body('shippingAddress.lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 1 })
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 1 })
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Zip code is required'),
  body('shippingAddress.phone')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Phone number is required'),
  body('paymentMethod')
    .isIn(['stripe', 'paypal', 'cod'])
    .withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    // Validate and process order items
    const processedOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      if (!product.isActive) {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      // Calculate price (consider discount)
      const price = product.discount > 0 
        ? product.price - (product.price * product.discount / 100)
        : product.price;

      processedOrderItems.push({
        product: product._id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        image: product.images[0],
        sku: product.sku
      });

      itemsPrice += price * item.quantity;

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate shipping and tax (in rupees)
    const shippingPrice = itemsPrice > 5000 ? 0 : 200; // Free shipping over ₹5000
    const taxPrice = itemsPrice * 0.18; // 18% GST
    const discountAmount = couponCode === 'ANIME10' ? itemsPrice * 0.1 : 0; // 10% discount

    const order = await Order.create({
      user: req.user._id,
      orderItems: processedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice: itemsPrice + shippingPrice + taxPrice - discountAmount,
      couponCode,
      discountAmount
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

/**
 * @route   GET /api/orders/myorders
 * @desc    Get logged in user orders
 * @access  Private
 */
router.get('/myorders', protect, customer, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('User orders fetch error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics (Admin only)
 * @access  Private/Admin
 */
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Get recent orders (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate total revenue
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      recentOrders,
      totalRevenue
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ message: 'Server error fetching order statistics' });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

/**
 * @route   PUT /api/orders/:id/pay
 * @desc    Update order to paid
 * @access  Private
 */
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Order payment update error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error updating order payment' });
  }
});

/**
 * @route   PUT /api/orders/:id/deliver
 * @desc    Update order to delivered (Admin only)
 * @access  Private/Admin
 */
router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = 'delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Order delivery update error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error updating order delivery' });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private/Admin
 */
router.put('/:id/status', protect, admin, [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber')
    .optional()
    .trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;
    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Order status update error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin only)
 * @access  Private/Admin
 */
router.get('/', protect, admin, async (req, res) => {
  try {
    const { limit = 10, status, sort = '-createdAt' } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price images')
      .sort(sort)
      .limit(parseInt(limit));

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 