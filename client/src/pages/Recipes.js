import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('default');
  const [sortField, setSortField] = useState('Title');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recipes/all')
      .then(response => response.json())
      .then(data => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setRecipes([
            {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 1',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 1',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'https://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 1',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
              {
                ChefImage: 'https://picsum.photos/800/600',
                ChefId: 1,
                Username: 'Default Chef 2',
                ImageUrl: 'https://picsum.photos/800/600',
                Title: 'Default Recipe 2',
                CookTime: 30,
                Views: 0,
                Rating: 0,
                RecipeId: 1,
                ProfilePicture: 'dhttps://picsum.photos/800/600',
                Description: 'This is a default recipe.',
                PreparationTime: 15,
                Cuisine: 'Default Cuisine 2',
              },
        ]);
        setIsLoading(false);
      });
  }, []);

  const filteredRecipes = recipes
    .filter(recipe =>
      recipe.Title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'default') {
        return 0;
      } else if (sortOrder === 'fileNames') {
        return a[sortField].localeCompare(b[sortField], undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      } else if (sortOrder === 'type') {
        return a[sortField].split('.').pop().localeCompare(b[sortField].split('.').pop());
      } else if (sortOrder === 'modified') {
        return new Date(b[sortField]) - new Date(a[sortField]);
      } else if (sortOrder === 'countDescending') {
        return b[sortField].length - a[sortField].length;
      } else if (sortOrder === 'countAscending') {
        return a[sortField].length - b[sortField].length;
      }
    })
    .slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(recipes.length / pageSize);

  return (
    <div className="container mx-auto px-4 mt-16">
      <h1 className="text-3xl font-bold mb-4">Recipes</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search recipes"
          className="border border-gray-400 rounded py-2 px-4 mr-2 flex-1"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setSearchQuery('')}
        >
          Clear
        </button>
      </div>
      <div className="flex mb-4">
        <label htmlFor="sortOrder" className="mr-2">
          Sort by:
        </label>
        <select
          id="sortOrder"
          className="border border-gray-400 rounded py-2 px-4 mr-2"
          value={sortOrder}
          onChange={event => setSortOrder(event.target.value)}
        >
          <option value="default">Default</option>
          <option value="fileNames">File Names</option>
          <option value="type">Type</option>
          <option value="modified">Modified</option>
          <option value="countDescending">Count (Descending)</option>
          <option value="countAscending">Count (Ascending)</option>
        </select>
        <select
          id="sortField"
          className="border border-gray-400 rounded py-2 px-4"
          value={sortField}
          onChange={event => setSortField(event.target.value)}
        >
          <option value="Title">Title</option>
          <option value="Cuisine">Cuisine</option>
          <option value="CookTime">Cook Time</option>
          <option value="PreparationTime">Preparation Time</option>
          <option value="Rating">Rating</option>
          <option value="Views">Views</option>
        </select>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 100-16 8 8 0 000 16z"
            ></path>
          </svg>
          <span>Loading recipes...</span>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-5 gap-4">
            {filteredRecipes.map(recipe => (
              <li key={recipe.RecipeId} className="w-full mb-4">
                <RecipeCard recipe={recipe} className="w-full" />
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-4">
            <button
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${
                page === 1 ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="bg-gray-300 text-gray-800 font-bold py-2 px-4">
              Page {page} of {totalPages}
            </span>
            <button
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r ${
                page === totalPages ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Recipes;