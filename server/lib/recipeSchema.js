import { z } from 'genkit';

// Zod schema for validating the core recipe data: ingredients, title, and instructions
export const RecipeSchema = z.object({
  /**
   * An array of ingredient names (strings) used to generate this recipe.
   * Must contain at least one ingredient.
   */
  ingredients: z.array(z.string({
      required_error: "Each ingredient must be a string",
      invalid_type_error: "Each ingredient must be a string",
    }))
    .min(1, { message: "Recipe must include at least one ingredient." })
    .describe("List of ingredients used in the recipe."),

  /**
   * The title of the generated recipe.
   * Must be a non-empty string.
   */
  title: z.string()
    .trim() // Remove leading/trailing whitespace before validation
    .min(1, { message: "Recipe title cannot be empty." })
    .describe("The title or name of the generated recipe."),

  /**
   * The cooking or preparation instructions for the recipe.
   * Must be a non-empty string.
   */
  instructions: z.string()
    .trim() // Remove leading/trailing whitespace before validation
    .min(1, { message: "Recipe instructions cannot be empty." })
    .describe("Step-by-step instructions for preparing the recipe."),
});