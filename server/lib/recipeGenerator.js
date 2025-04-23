// src/lib/recipeGenerator.js

// Assuming dotenv is configured in server.js, GEMINI_API_KEY should be available
if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not found in environment variables. Genkit initialization might fail.");
    // Consider throwing an error or handling this case more robustly
    // For now, we proceed, but Genkit will likely fail.
}

const { genkit, z } = require('genkit'); // Assuming genkit is installed globally or locally
const { googleAI, gemini20Flash } = require('@genkit-ai/googleai'); // Assuming plugin is installed
// Ensure this path is correct relative to recipeGenerator.js
// Let's assume you renamed the Zod schema file appropriately
const { RecipeCoreSchema } = require('./recipeSchema'); // Use the schema with ingredients, title, instructions

const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
    logLevel: 'debug', // Optional: for more detailed logging from Genkit
    enableTracing: true // Optional: for tracing
});

/**
 * Generates a recipe using Genkit and Google AI based on provided ingredients.
 * @param {string[]} ingredients - An array of ingredient strings.
 * @returns {Promise<object>} A promise that resolves to an object matching RecipeCoreSchema (ingredients, title, instructions).
 * @throws {Error} Throws an error if recipe generation fails or the output doesn't match the schema.
 */
async function generateRecipe(ingredients) {
    // Validate input slightly (ensure it's a non-empty array)
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        throw new Error("Ingredients must be provided as a non-empty array.");
    }

    const ingredientsString = ingredients.join(', ');
    console.log(`Generating recipe with ingredients: ${ingredientsString}`);

    try {
        const { output } = await ai.generate({
            model: gemini20Flash,
            prompt: `Create a recipe using ONLY the following ingredients: ${ingredientsString}. Include a title, the list of ingredients used (must be from the provided list or a subset), and step-by-step instructions. Strictly follow the output format defined by the schema and do not include any additional explanatory text or markdown formatting. If the ingredients are insufficient for a standard recipe, be creative but only use the provided items.`,
            output: {
                schema: RecipeCoreSchema // Use the imported Zod schema for output validation
            },
            config: {
                // Optional: Adjust temperature for creativity (0.0 = deterministic, 1.0 = creative)
                 temperature: 0.0,
            }
        });

        if (!output) {
             throw new Error("Recipe generation returned no output.");
        }
        console.log("Generated Recipe Output:", output);
        // The output is already validated against RecipeCoreSchema by Genkit if no error was thrown
        return output;

    } catch (error) {
        console.error("Error during recipe generation with Genkit:", error);
        // Re-throw a more specific error or handle as needed
        if (error.message.includes('Output validation failed')) {
             throw new Error(`Recipe generation failed: Output did not match the required schema. Details: ${error.message}`);
        }
        throw new Error(`Recipe generation failed: ${error.message}`);
    }
}

module.exports = generateRecipe;