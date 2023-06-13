import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpWideShort, faArrowUpShortWide } from '@fortawesome/free-solid-svg-icons';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ modified: '', current: '' });
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState({ modified: 'ASC', current: 'ASC' });
  const [sortField, setSortField] = useState({ modified: 'title', current: 'title' });
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  async function setComponents() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/recipe/get?sortBy=${sortField.current}&sortOrder=${sortOrder.current}&pageSize=${pageSize}&page=1&search=${searchQuery.current}`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status !== 200 && response.status !== 304) return;
      const json = await response.json();
      setRecipes(json.response[0]);
      setTotalPages(json.response[1][0].TotalPages);
      setIsLoading(false);
    } catch (error) {
      console.log("error:");
      console.log(error);
    }
  }
  async function searchRecipes() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/recipe/get?sortBy=${sortField.modified}&sortOrder=${sortOrder.modified}&pageSize=${pageSize}&page=1&search=${searchQuery.modified}`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status !== 200 && response.status !== 304) return;
      const json = await response.json();
      setRecipes(json.response[0]);
      setSortField(prev => { return { ...prev, current: prev.modified } });
      setSearchQuery(prev => { return { ...prev, current: prev.modified } });
      setSortOrder(prev => { return { ...prev, current: prev.modified } });
      setTotalPages(json.response[1][0].TotalPages)
      setPage(1);
    } catch (error) {
      console.log(error);
    }
  }
  async function changePage(incrementor) {
    try {
      if (page + incrementor <= 0 || (incrementor !== -1 && incrementor !== 1)) return;
      console.log("---------------------------")
      const response = await fetch(
        `http://localhost:5000/api/recipe/get?sortBy=${sortField.current}&sortOrder=${sortOrder.current}&pageSize=${pageSize}&page=${page + incrementor}&search=${searchQuery.current}`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token')
        }
      });
      if (response.status !== 200 && response.status !== 304) return;
      const json = await response.json();
      setRecipes(json.response[0]);
      setPage(prev => prev + incrementor);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(recipes)
  useEffect(() => {
    setComponents();
  }, []);

  return (
    <div className="container mx-auto px-4 mt-24">
      <h1 className="text-3xl font-bold mb-4">Recipes</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search recipes"
          className="border border-gray-400 rounded py-2 px-4 mr-2 flex-1"
          value={searchQuery.modified}
          onChange={event => setSearchQuery(prev => { return { ...prev, modified: event.target.value } })}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => searchRecipes()}
        >
          SEARCH
        </button>
      </div>
      <div className="flex mb-4">
        <label htmlFor="sortOrder" className="mr-2">
          Sort by:
        </label>
        <select
          id="sortOrder"
          className="border border-gray-400 rounded py-2 px-4 mr-2"
          value={sortOrder.modified}
          onChange={event => setSortOrder(prev => { return { ...prev, modified: event.target.value } })}
        >
          <option value="DESC"><FontAwesomeIcon icon={faArrowUpShortWide} />Descending</option>
          <option value="ASC"><FontAwesomeIcon icon={faArrowUpWideShort} />Ascending</option>
        </select>
        <select
          id="sortField"
          className="border border-gray-400 rounded py-2 px-4"
          value={sortField.modified}
          onChange={event => setSortField(prev => { return { ...prev, modified: event.target.value } })}
        >
          <option value="title">Title</option>
          <option value="cuisine">Cuisine</option>
          <option value="cookTime">Cook Time</option>
          <option value="prepTime">Preparation Time</option>
          <option value="rating">Rating</option>
          <option value="views">Views</option>
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
            {recipes.map((recipe) => {
              return <li key={recipe.RecipeId} className="w-full mb-4">
                <RecipeCard recipe={recipe} setRecipes={setRecipes} index={0} className="w-full" />
              </li>
            })}
          </ul>
          <div className="flex justify-center mt-4">
            <button
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${page === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
              disabled={page === 1}
              onClick={() => changePage(-1)}
            >
              Previous
            </button>
            <span className="bg-gray-300 text-gray-800 font-bold py-2 px-4">
              Page {page} of {totalPages}
            </span>
            <button
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r ${page === totalPages ? 'cursor-not-allowed opacity-50' : ''
                }`}
              disabled={page === totalPages}
              onClick={() => changePage(1)}
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