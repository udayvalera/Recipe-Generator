
import React, { useState, useEffect } from 'react';
import { fetchIngredients, addIngredient, Ingredient } from '../services/api';
import { Plus, Search } from 'lucide-react';

interface IngredientManagerProps {
  selectedIngredientIds: string[];
  onSelectionChange: (id: string) => void;
}

const IngredientManager: React.FC<IngredientManagerProps> = ({
  selectedIngredientIds,
  onSelectionChange
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    setIsLoadingIngredients(true);
    setError(null);
    try {
      const data = await fetchIngredients();
      setIngredients(data);
    } catch (err) {
      setError('Failed to load ingredients');
      console.error(err);
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;

    setIsAddingIngredient(true);
    setError(null);
    try {
      const newIngredient = await addIngredient(newIngredientName.trim());
      setIngredients([...ingredients, newIngredient]);
      setNewIngredientName('');
    } catch (err) {
      setError('Failed to add ingredient');
      console.error(err);
    } finally {
      setIsAddingIngredient(false);
    }
  };

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (id: string) => selectedIngredientIds.includes(id);

  const handleIngredientClick = (id: string) => {
    onSelectionChange(id);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Your Pantry</h2>
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <form onSubmit={handleAddIngredient} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newIngredientName}
          onChange={(e) => setNewIngredientName(e.target.value)}
          placeholder="Add new item..."
          className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-recipe-purple"
          disabled={isAddingIngredient}
        />
        <button
          type="submit"
          className="bg-recipe-purple text-white rounded-md p-2 hover:bg-opacity-90 disabled:opacity-50"
          disabled={isAddingIngredient || !newIngredientName.trim()}
        >
          {isAddingIngredient ? (
            <span className="flex items-center justify-center w-6 h-6">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          ) : (
            <Plus size={24} />
          )}
        </button>
      </form>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-white border rounded-md py-2 pl-10 pr-4 block w-full focus:outline-none focus:ring-2 focus:ring-recipe-purple"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoadingIngredients ? (
        <div className="flex justify-center my-8">
          <svg className="animate-spin h-8 w-8 text-recipe-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {filteredIngredients.length > 0 ? (
            filteredIngredients.map((ingredient) => (
              <div
                key={ingredient._id}
                onClick={() => handleIngredientClick(ingredient._id)}
                className={`p-4 bg-gray-50 rounded-md cursor-pointer transition-all ${
                  isSelected(ingredient._id) ? 'bg-recipe-purple bg-opacity-20 border-2 border-recipe-purple' : 'hover:bg-gray-100'
                }`}
              >
                {ingredient.name}
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center py-4">
              {ingredients.length === 0 ? 'No ingredients found. Add some!' : 'No matching ingredients found.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientManager;
