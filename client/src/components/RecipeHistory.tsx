
import React, { useState, useEffect } from 'react';
import { fetchRecipeHistory, Recipe } from '../services/api';
import { Clock, ChevronDown } from 'lucide-react';

interface RecipeHistoryProps {
  refreshTrigger: number;
  onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeHistory: React.FC<RecipeHistoryProps> = ({ 
  refreshTrigger, 
  onRecipeSelect 
}) => {
  const [history, setHistory] = useState<Recipe[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    setError(null);
    try {
      const data = await fetchRecipeHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load recipe history');
      console.error(err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const toggleRecipeExpansion = (recipeId: string) => {
    setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="my-8">
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-recipe-purple" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        <h2 className="text-xl font-semibold">Recipe History</h2>
      </div>
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      {isLoadingHistory ? (
        <div className="flex justify-center my-8">
          <svg className="animate-spin h-8 w-8 text-recipe-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="space-y-3">
          {history.length > 0 ? (
            history.map((recipe) => (
              <div 
                key={recipe._id}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRecipeExpansion(recipe._id)}
                >
                  <div>
                    <h3 className="font-medium">{recipe.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(recipe.createdAt)}
                    </p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedRecipeId === recipe._id ? 'transform rotate-180' : ''}`} />
                </div>
                
                {expandedRecipeId === recipe._id && (
                  <div className="px-4 pb-4 border-t">
                    <div className="my-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Ingredients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.map((ing, i) => (
                          <span 
                            key={i}
                            className="text-xs bg-gray-100 rounded-full px-2 py-1"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      className="text-sm text-recipe-purple hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecipeSelect(recipe);
                      }}
                    >
                      View full recipe
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recipes found. Generate your first recipe!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeHistory;
