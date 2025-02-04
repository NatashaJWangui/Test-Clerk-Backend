const express = require('express');
const { Clerk } = require('@clerk/express');
const router = express.Router();

// Use Clerk's middleware for authentication
router.use(Clerk.express());


// Admin Dashboard Route (protected)
router.get('/admin/dashboard', Clerk.requireSession(), (req, res) => {
  // The Clerk session is now validated, and the user data is available via `req.user`
  const user = req.user;
  
  res.json({
    message: `Welcome to the Admin Dashboard, ${user.firstName}!`,
  });
});

// Admin Login Route (using Clerk for authentication)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Use Clerk's sign-in API to authenticate the user (admin in this case)
    const { user, session } = await Clerk.users.signIn({
      email,
      password,
    });
    
    // Return the session token to the client
    res.json({
      success: true,
      token: session.id, // Use Clerk's session ID for the user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ success: false, message: 'Authentication failed' });
  }
});

module.exports = router;
