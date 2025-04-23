
import { Ingredient, Recipe } from './api';

// Mock data
let ingredients: Ingredient[] = [
  {
    _id: "66279ec4a1b2c3d4e5f6a7b8",
    name: "Chicken",
    createdAt: "2025-04-23T09:45:08.123Z",
    updatedAt: "2025-04-23T09:45:08.123Z",
    __v: 0
  },
  {
    _id: "66279ec4a1b2c3d4e5f6a7b9",
    name: "Rice",
    createdAt: "2025-04-23T09:45:08.123Z",
    updatedAt: "2025-04-23T09:45:08.123Z",
    __v: 0
  },
  {
    _id: "66279f10a1b2c3d4e5f6a7ba",
    name: "Tomatoes",
    createdAt: "2025-04-23T09:46:24.456Z",
    updatedAt: "2025-04-23T09:46:24.456Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7bc",
    name: "Onions",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7bd",
    name: "Garlic",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7be",
    name: "Bell Peppers",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7bf",
    name: "Olive Oil",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7c1",
    name: "Eggs",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7c2",
    name: "Milk",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7c3",
    name: "Cheese",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7c4",
    name: "Butter",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  },
  {
    _id: "66279f18a1b2c3d4e5f6a7c5",
    name: "Pasta",
    createdAt: "2025-04-23T09:46:32.789Z",
    updatedAt: "2025-04-23T09:46:32.789Z",
    __v: 0
  }
];

let recipes: Recipe[] = [
  {
    _id: "6627a14fa1b2c3d4e5f6a7c0",
    ingredients: [
      "Chicken",
      "Rice",
      "Bell Peppers",
      "Onions"
    ],
    title: "Chicken & Rice Stir-fry",
    instructions: "1. Cut chicken into bite-sized pieces and season with salt and pepper.\n2. Heat oil in a large skillet over medium-high heat.\n3. Cook chicken until golden brown, about 5-7 minutes.\n4. Add diced bell peppers and onions, cook for 3-4 minutes until softened.\n5. Add cooked rice and stir to combine.\n6. Season with soy sauce or your favorite seasonings.\n7. Cook for an additional 2-3 minutes until everything is heated through.\n8. Serve hot and enjoy!",
    createdAt: "2025-04-23T09:55:59.123Z",
    updatedAt: "2025-04-23T09:55:59.123Z",
    __v: 0
  }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockFetchIngredients = async (): Promise<Ingredient[]> => {
  await delay(800); // Simulate network delay
  return [...ingredients];
};

export const mockAddIngredient = async (name: string): Promise<Ingredient> => {
  await delay(600);
  
  const newIngredient: Ingredient = {
    _id: `ingredient_${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  };
  
  ingredients.push(newIngredient);
  return newIngredient;
};

export const mockGenerateRecipe = async (itemIds: string[]): Promise<Recipe> => {
  await delay(1500); // Longer delay for recipe generation
  
  // Find the names of the selected ingredients
  const selectedIngredients = ingredients
    .filter(ing => itemIds.includes(ing._id))
    .map(ing => ing.name);
  
  // Generate a simple recipe based on ingredients
  const newRecipe: Recipe = {
    _id: `recipe_${Date.now()}`,
    title: generateRecipeTitle(selectedIngredients),
    ingredients: selectedIngredients,
    instructions: generateInstructions(selectedIngredients),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  };
  
  recipes.unshift(newRecipe); // Add to beginning of array
  return newRecipe;
};

export const mockFetchRecipeHistory = async (): Promise<Recipe[]> => {
  await delay(800);
  return [...recipes];
};

// Helper functions to generate recipe content
function generateRecipeTitle(ingredients: string[]): string {
  if (ingredients.includes("Chicken") && ingredients.includes("Rice")) {
    return "Chicken & Rice Bowl";
  } else if (ingredients.includes("Pasta") && ingredients.includes("Tomatoes")) {
    return "Simple Tomato Pasta";
  } else if (ingredients.includes("Eggs") && ingredients.includes("Cheese")) {
    return "Cheesy Scrambled Eggs";
  } else {
    const mainIngredient = ingredients[0] || "Mixed";
    return `${mainIngredient} Delight`;
  }
}

function generateInstructions(ingredients: string[]): string {
  let instructions = "";
  
  instructions += "1. Prepare all ingredients by washing and cutting them as needed.\n";
  
  if (ingredients.includes("Chicken")) {
    instructions += "2. Season the chicken with salt and pepper.\n";
    instructions += "3. Cook the chicken in a pan until golden brown and fully cooked.\n";
  }
  
  if (ingredients.includes("Rice")) {
    instructions += "4. Cook rice according to package instructions.\n";
  }
  
  if (ingredients.includes("Pasta")) {
    instructions += "4. Cook pasta in boiling salted water until al dente.\n";
  }
  
  if (ingredients.includes("Tomatoes") || ingredients.includes("Bell Peppers") || ingredients.includes("Onions")) {
    instructions += "5. Sauté vegetables until softened.\n";
  }
  
  if (ingredients.includes("Eggs")) {
    instructions += "6. Beat eggs and cook in a non-stick pan until scrambled.\n";
  }
  
  if (ingredients.includes("Cheese")) {
    instructions += "7. Sprinkle cheese on top and allow to melt.\n";
  }
  
  instructions += `8. Combine all ingredients in a serving dish.\n9. Season to taste and enjoy your meal!`;
  
  return instructions;
}
