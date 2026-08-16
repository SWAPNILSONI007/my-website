const mongoose = require('mongoose');

// Auto-incrementing order number counter
const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, sparse: true }, // e.g. SLV-00001
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerMobile: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerLandmark: { type: String, default: '' },
  customerCity: { type: String, required: true },
  customerState: { type: String, default: '' },
  customerPin: { type: String, required: true },
  items: [{
    name: String,
    price: Number,
    qty: { type: Number, default: 1 },
    emoji: String,
    id: String,
    sku: { type: String, default: '' },
    image: String
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD', enum: ['COD', 'Razorpay'] },
  paymentId: { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed'] },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  giftWrap: { type: Boolean, default: false },
  giftMessage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate SLV-XXXXX order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.orderNumber) return next(); // already set
  try {
    const counter = await Counter.findByIdAndUpdate(
      'orderNumber',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.orderNumber = 'SLV-' + String(counter.seq).padStart(5, '0');
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model('Order', OrderSchema);
