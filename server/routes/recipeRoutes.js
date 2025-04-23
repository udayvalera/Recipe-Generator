// routes/recipeRoutes.js
const express = require('express');
const { generateAndSaveRecipe, getRecipeHistory } = require('../controllers/recipeController');

const router = express.Router();

// Note: The full path will be /api/recipes/basket/generate-recipe when mounted in server.js
router.post('/basket/generate-recipe', generateAndSaveRecipe);

// Note: The full path will be /api/recipes/history when mounted in server.js
router.get('/history', getRecipeHistory);

module.exports = router;