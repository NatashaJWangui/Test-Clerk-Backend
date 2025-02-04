const express = require('express');
const { getAuth, clerkClient, requireAuth } = require('@clerk/express');
const router = express.Router();

// Use Clerk's middleware for authentication
router.use(requireAuth());


// Admin Dashboard Route (protected)
router.get('/admin/dashboard', async (req, res) => {
  try {
    // Get the user's `userId` from Clerk
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    res.json({
      message: `Welcome to the Admin Dashboard, ${user.firstName}!`,
      user,
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

// Admin Login Route (Verifying Clerk Session)
router.post('/login', async (req, res) => {
  const { sessionToken } = req.body; // Expect a session token from frontend authentication

  try {
    if (!sessionToken) {
      return res.status(400).json({ error: 'Session token is required' });
    }

    // Verify session with Clerk
    const session = await clerkClient.sessions.verifySession(sessionToken);

    if (!session || session.status !== 'active') {
      return res.status(401).json({ error: 'Invalid or inactive session' });
    }

    // Fetch user details
    const user = await clerkClient.users.getUser(session.userId);

    res.json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
