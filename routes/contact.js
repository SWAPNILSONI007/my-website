const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Save contact form
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ success: true, msg: '✅ Message mil gaya! Hum jald contact karenge.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all contacts (admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;