// api.ts
import axios from 'axios';

// --- Configuration ---
// Assuming your frontend dev server proxies '/api' requests to your backend (e.g., http://localhost:5001)
// If not, replace baseURL with your full backend API URL, possibly from environment variables
// Example: const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API_BASE_URL = "https://recipe-generator-backend-vqb7.onrender.com/api/"; // Use '/api' if proxy is set up

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Set default header for POST/PUT
  }
});

// --- Interfaces ---
// These interfaces match the expected structure of data coming from the backend MongoDB models
export interface Ingredient {
  _id: string;
  name: string;
  createdAt: string; // Expecting ISO date strings
  updatedAt: string; // Expecting ISO date strings
  __v?: number; // Mongoose version key, often optional in frontend use
}

export interface Recipe {
  _id: string;
  ingredients: string[]; // The list of ingredients used for generation request
  title: string;
  instructions: string;
  createdAt: string; // Expecting ISO date strings
  updatedAt: string; // Expecting ISO date strings
  __v?: number; // Mongoose version key, often optional in frontend use
}

// --- API Functions ---

/**
 * Fetches all available ingredients from the backend.
 * Corresponds to GET /api/items
 */
export const fetchIngredients = async (): Promise<Ingredient[]> => {
  try {
    console.log('Fetching ingredients from API...');
    const response = await api.get('/items');
    // Backend directly returns the array of ingredients
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    // Re-throw the error for the calling component to handle
    throw error;
  }
};

/**
 * Adds a new ingredient to the backend database.
 * Corresponds to POST /api/items/add
 * @param {string} ingredientName - The name of the ingredient to add.
 */
export const addIngredient = async (ingredientName: string): Promise<Ingredient> => {
  try {
    console.log(`Adding ingredient "${ingredientName}" via API...`);
    // Backend expects the body format { "item": "..." }
    const response = await api.post('/items/add', { item: ingredientName });
    // Backend returns { message: '...', item: newItem }
    // Extract and return the 'item' object which is the new Ingredient
    if (!response.data || !response.data.item) {
        throw new Error("Invalid response structure from addIngredient API");
    }
    return response.data.item;
  } catch (error) {
    console.error(`Error adding ingredient "${ingredientName}":`, error);
    throw error;
  }
};

/**
 * Sends a list of ingredient names to the backend to generate and save a recipe.
 * Corresponds to POST /api/recipes/basket/generate-recipe
 * @param {string[]} ingredientNames - An array of ingredient names.
 */
export const generateRecipe = async (ingredientNames: string[]): Promise<Recipe> => {
  try {
    console.log(`Generating recipe with ingredients "${ingredientNames.join(', ')}" via API...`);
    // Backend expects the body format { "items": ["...", "..."] }
    const response = await api.post('/recipes/basket/generate-recipe', { items: ingredientNames });
    // Backend returns { message: '...', recipe: newRecipe }
    // Extract and return the 'recipe' object
     if (!response.data || !response.data.recipe) {
        throw new Error("Invalid response structure from generateRecipe API");
    }
    return response.data.recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
};

/**
 * Fetches the history of previously generated recipes.
 * Corresponds to GET /api/recipes/history
 */
export const fetchRecipeHistory = async (): Promise<Recipe[]> => {
  try {
    console.log('Fetching recipe history from API...');
    const response = await api.get('/recipes/history');
    // Backend directly returns the array of recipes
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe history:', error);
    throw error;
  }
};
