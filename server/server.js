// server.js
require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import your DB connection function

// --- Connect to Database ---
connectDB();

// --- Import Routes ---
const itemRoutes = require('./routes/itemRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies (optional but good practice)


// --- Mount Routes ---
app.use('/api/items', itemRoutes);       // All routes in itemRoutes will be prefixed with /api/items
app.use('/api/recipes', recipeRoutes);   // All routes in recipeRoutes will be prefixed with /api/recipes

// --- Basic Health Check Route (Optional) ---
app.get('/', (req, res) => {
    res.send('Recipe API Running');
});


// --- Error Handling Middleware (Should be last) ---

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global Error Handler
// Needs all 4 arguments to be recognized by Express as an error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use existing status code if set, otherwise 500
  res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      // Optionally include stack trace in development
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});