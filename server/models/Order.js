const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'US' },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'cod']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  couponCode: {
    type: String,
    trim: true
  },
  discountAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('orderItems') || this.isModified('shippingPrice') || this.isModified('taxPrice')) {
    this.itemsPrice = this.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.totalPrice = this.itemsPrice + this.shippingPrice + this.taxPrice - this.discountAmount;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === 'delivered') {
    this.isDelivered = true;
    this.deliveredAt = new Date();
  }
  
  return this.save();
};

// Method to mark as paid
orderSchema.methods.markAsPaid = function(paymentResult) {
  this.isPaid = true;
  this.paidAt = new Date();
  this.paymentResult = paymentResult;
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema); 