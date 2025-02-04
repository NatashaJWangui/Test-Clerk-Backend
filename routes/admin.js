// backend/routes/admin.js
const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();

// Protect your admin routes with Clerk authentication
router.use(requireAuth());

// Test route to check connectivity
router.get('/test', (req, res) => {
  res.send('Admin route is working');
});

router.get('/dashboard', (req, res) => {
  const user = req.auth.user;
  if (!user) {
    return res.status(401).send('Unauthorized');
  }
  // Logic for returning dashboard data
  res.send({ message: 'Welcome to the Admin Dashboard', user });
});

module.exports = router;
