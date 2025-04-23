
import { useState, useEffect } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import IngredientManager from './components/IngredientManager';
import RecipeGenerator from './components/RecipeGenerator';
import RecipeDisplay from './components/RecipeDisplay';
import RecipeHistory from './components/RecipeHistory';
import { Recipe, Ingredient, fetchIngredients } from './services/api';
import './App.css';

const App = () => {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const data = await fetchIngredients();
        setIngredients(data);
      } catch (error) {
        console.error("Failed to load ingredients:", error);
      }
    };
    
    loadIngredients();
  }, []);

  const handleSelectionChange = (ingredientId: string) => {
    setSelectedIngredientIds(prev => {
      if (prev.includes(ingredientId)) {
        return prev.filter(id => id !== ingredientId);
      } else {
        return [...prev, ingredientId];
      }
    });
  };

  const handleRecipeGenerated = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setRefreshHistoryTrigger(prev => prev + 1);
    // Clear selection after generating a recipe
    setSelectedIngredientIds([]);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-recipe-purple" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h1 className="text-3xl font-bold">
                <span className="text-black">Recipe </span>
                <span className="text-recipe-purple">Generator</span>
              </h1>
            </div>
            <p className="text-gray-500">Select ingredients from your pantry and generate delicious recipes!</p>
          </header>
          
          <main>
            <IngredientManager 
              selectedIngredientIds={selectedIngredientIds} 
              onSelectionChange={handleSelectionChange} 
            />
            
            <RecipeGenerator 
              selectedIngredientIds={selectedIngredientIds} 
              onRecipeGenerated={handleRecipeGenerated}
              ingredients={ingredients}
            />
            
            <RecipeDisplay recipe={currentRecipe} />
            
            <RecipeHistory 
              refreshTrigger={refreshHistoryTrigger} 
              onRecipeSelect={handleRecipeSelect} 
            />
          </main>
          
          <footer className="mt-12 pt-6 border-t text-center text-gray-500 text-sm">
            <p>© 2025 Recipe Generator. All rights reserved.</p>
          </footer>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default App;
