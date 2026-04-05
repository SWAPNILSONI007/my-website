const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Lazy Razorpay init (Vercel-safe)
let razorpay = null;
function getRazorpay() {
  if (!razorpay) {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

// POST /api/payment/create-order
// Creates a Razorpay order and returns the order_id to the frontend
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await getRazorpay().orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    res.status(500).json({ success: false, message: 'Payment gateway error', error: err.message });
  }
});

// POST /api/payment/verify
// Verifies Razorpay payment signature after successful payment
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }
  } catch (err) {
    console.error('Razorpay verify error:', err);
    res.status(500).json({ success: false, message: 'Verification error' });
  }
});

module.exports = router;
