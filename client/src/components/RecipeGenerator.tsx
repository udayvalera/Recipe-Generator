import React, { useState } from 'react';
// Assuming api.ts is correctly set up to send ingredient names
import { generateRecipe, Recipe, Ingredient } from '../services/api';

interface RecipeGeneratorProps {
  // Still receives IDs from the parent component managing selection
  selectedIngredientIds: string[];
  onRecipeGenerated: (recipe: Recipe) => void;
  // Full list of ingredients needed to map IDs to names
  ingredients: Ingredient[];
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({
  selectedIngredientIds,
  onRecipeGenerated,
  ingredients // Pass the full ingredients list as a prop
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipe = async () => {
    if (selectedIngredientIds.length === 0) {
        setError("Please select ingredients first."); // Provide feedback
        return;
    };

    setIsGenerating(true);
    setError(null);

    // --- Find the names corresponding to the selected IDs ---
    const selectedIngredientNames = selectedIngredientIds.map(id => {
      const ingredient = ingredients.find(i => i._id === id);
      return ingredient ? ingredient.name : null; // Return name or null if not found
    }).filter((name): name is string => name !== null); // Filter out any nulls (if an ID didn't match)

    // --- Check if we have names to send ---
    if (selectedIngredientNames.length === 0 && selectedIngredientIds.length > 0) {
        setError("Could not find names for selected ingredients.");
        setIsGenerating(false);
        return;
    }
     if (selectedIngredientNames.length !== selectedIngredientIds.length) {
         console.warn("Some selected ingredient IDs did not map to names.");
         // Decide if you want to proceed or show an error
     }


    try {
      // --- Call the API with the array of names ---
      console.log('Sending ingredient names to generateRecipe:', selectedIngredientNames); // Debug log
      const recipe = await generateRecipe(selectedIngredientNames);
      onRecipeGenerated(recipe);
    } catch (err: any) { // Catch specific error type if possible
      setError(err.message || 'Failed to generate recipe. Please try again.');
      console.error("Error generating recipe:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Render Logic (mostly unchanged) ---
  return (
    <div className="my-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      {error && <p className="text-red-600 mb-3 text-sm bg-red-100 p-2 rounded">{error}</p>}

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          {/* Basket Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">Your Basket</h2>
        </div>

        {/* Item Count Badge */}
        <div className="bg-indigo-600 text-white rounded-full px-3 py-1 text-xs font-medium">
          {selectedIngredientIds.length} {selectedIngredientIds.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Selected Items Display Area */}
      <div className="bg-gray-50 p-4 rounded-md mb-4 min-h-[80px] border border-gray-100">
        {selectedIngredientIds.length > 0 ? (
          <div className="space-y-3">
             {/* Removed the text-center paragraph for more space */}
            <div className="flex flex-wrap gap-2 justify-center">
              {/* Map over IDs to display names */}
              {selectedIngredientIds.map(id => {
                const ingredient = ingredients.find(i => i._id === id);
                return ingredient ? (
                  <span key={id} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    {ingredient.name}
                  </span>
                ) : (
                    // Optionally show placeholder if name not found (shouldn't happen ideally)
                    <span key={id} className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-sm italic">
                      Loading...
                    </span>
                 );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center pt-4">Your basket is empty. Add items from your pantry!</p>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateRecipe}
        disabled={isGenerating || selectedIngredientIds.length === 0}
        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            {/* Loading Spinner */}
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Recipe...
          </span>
        ) : (
          'Generate Recipe'
        )}
      </button>
    </div>
  );
};

export default RecipeGenerator;