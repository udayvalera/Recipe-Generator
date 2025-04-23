// models/Recipe.js
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  ingredients: {
      type: [String], // Array of strings
      required: [true, 'Ingredients list cannot be empty'],
      validate: [v => Array.isArray(v) && v.length > 0, 'Ingredients list cannot be empty']
  },
  title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true
  },
  instructions: {
      type: [String],
      required: [true, 'Recipe instructions are required']
  },
  // You could add more fields like prep time, cook time, difficulty, image URL, etc.
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);