const mongoose = require('mongoose');

const CustomDesignSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  designTitle: { type: String, required: true },
  description: { type: String },
  fileName: { type: String },
  fileType: { type: String },
  fileData: { type: String }, // Base64 encoded
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  adminNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomDesign', CustomDesignSchema);
