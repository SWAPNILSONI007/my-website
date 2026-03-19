const express = require('express');
const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USERNAME || 'navyra_admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'navyra@2026';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: 'navyra-admin-token' });
  } else {
    res.status(401).json({ success: false, msg: 'Wrong credentials' });
  }
});

router.post('/verify', (req, res) => {
  const { token } = req.body;
  if (token === 'navyra-admin-token') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

module.exports = router;