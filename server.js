require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


// Log the current environment
if (process.env.NODE_ENV === 'production') {
  console.log('App is running in production mode');
} else if (process.env.NODE_ENV === 'development') {
  console.log('App is running in development mode');
} else {
  console.log('Environment is not set or is unknown');
}

console.log('NODE_ENV:', process.env.NODE_ENV); // Check what value is being read

// Import routes
const adminRoutes = require('./routes/admin');

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));

// Middleware to parse JSON
app.use(helmet()); // Security headers
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // Logging
app.use(express.json());

// Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});


// Routes
app.use('/admin', adminRoutes);  // Clerk authentication 

app.get('/', (req, res) => {
  res.send('Test Clerk App Backend is running!');
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'unknown',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
