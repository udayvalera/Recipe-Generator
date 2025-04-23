// controllers/recipeController.js
const Recipe = require('../models/Recipe');
const generateRecipeFromIngredients = require('../lib/recipeGenerator');

// @desc    Generate recipe from basket items and save it
// @route   POST /api/recipes/basket/generate-recipe
// @access  Public
exports.generateAndSaveRecipe = async (req, res) => {
  try {
    const { items } = req.body;
    console.log(items)

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty.' });
    }
    // Optional: Sanitize or validate items array elements further if needed

    console.log(`Received items for recipe generation: ${items.join(', ')}`);

    // --- Generate Recipe using the imported function ---
    // Pass only the array of ingredient strings
    const generatedRecipeData = await generateRecipeFromIngredients(items);
    // --- Save the generated recipe to MongoDB ---
    // We use the 'items' from the original request as the ingredients stored,
    // as the generated recipe might sometimes omit or slightly alter them,
    // but we want to record what the user *intended* to use.
    // The generatedRecipeData.ingredients could also be stored if needed, perhaps in a separate field.
    const newRecipe = new Recipe({
      ingredients: items, // Use the original input items list
      title: generatedRecipeData.recipe.title, // Use title from generator
      instructions: generatedRecipeData.recipe.instructions // Use instructions from generator
    });

    await newRecipe.save();
    console.log(`Recipe "${newRecipe.title}" saved successfully.`);

    // Return the newly created recipe document (includes _id, timestamps etc.)
    res.status(201).json({ message: 'Recipe generated and saved successfully', recipe: newRecipe });

  } catch (error) {
    console.error("Error in generateAndSaveRecipe controller:", error);

    // Check for specific errors from the generator function or database
    if (error.message.startsWith('Recipe generation failed')) {
         // Use 502 (Bad Gateway) if the external API call failed, or 500/400 if input/schema related
         const statusCode = error.message.includes('Output did not match') ? 500 : 502;
         res.status(statusCode).json({ message: 'Error generating recipe via external service.', error: error.message });
    } else if (error.message.includes('Ingredients must be provided')) {
         res.status(400).json({ message: 'Input Validation Error.', error: error.message });
    }
     else if (error.name === 'ValidationError') { // Mongoose validation error on save
         res.status(400).json({ message: 'Validation Error saving recipe', errors: error.errors });
    }
    else {
        // Generic internal server error
        res.status(500).json({ message: 'Failed to process recipe request.', error: error.message });
    }
  }
};


// @desc    Get recipe history
// @route   GET /api/recipes/history
// @access  Public
exports.getRecipeHistory = async (req, res) => {
  try {
    // Fetch recipes, sort by creation date descending (newest first)
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipe history:", error);
    res.status(500).json({ message: 'Failed to fetch recipe history', error: error.message });
  }
};