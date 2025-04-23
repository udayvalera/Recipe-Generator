
import React from 'react';
import { Recipe } from '../services/api';

interface RecipeDisplayProps {
  recipe: Recipe | null;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  if (!recipe) {
    return null;
  }

  return (
    <div className="my-8 p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-center text-recipe-purple">{recipe.title}</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Ingredients:</h3>
        <ul className="list-disc pl-6 space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-600">{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2 text-gray-700">Instructions:</h3>
        <div className="text-gray-600 whitespace-pre-line">{recipe.instructions}</div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
