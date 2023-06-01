import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClock } from '@fortawesome/free-solid-svg-icons';


const recipes = [
  {
    title: 'Spicy Garlic Shrimp',
    image: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    description: 'A mouthwatering dish with a kick of spice and garlic.',
    rating: 4.5,
    category: 'Seafood',
    prepTime: '30 mins',
    cookTime: '15 mins',
  },
  {
    title: 'Avocado Toast',
    image: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    description: 'A classic breakfast recipe with a twist of creamy avocado.',
    rating: 5,
    category: 'Breakfast',
    prepTime: '10 mins',
    cookTime: '5 mins',
  },
  {
    title: 'Spicy Garlic Shrimp',
    image: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    description: 'A mouthwatering dish with a kick of spice and garlic.',
    rating: 4.5,
    category: 'Seafood',
    prepTime: '30 mins',
    cookTime: '15 mins',
  },
  {
    title: 'Avocado Toast',
    image: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    description: 'A classic breakfast recipe with a twist of creamy avocado.',
    rating: 5,
    category: 'Breakfast',
    prepTime: '10 mins',
    cookTime: '5 mins',
  },
  {
    title: 'Spicy Garlic Shrimp',
    image: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    description: 'A mouthwatering dish with a kick of spice and garlic.',
    rating: 4.5,
    category: 'Seafood',
    prepTime: '30 mins',
    cookTime: '15 mins',
  },
  {
    title: 'Avocado Toast',
    image: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    description: 'A classic breakfast recipe with a twist of creamy avocado.',
    rating: 5,
    category: 'Breakfast',
    prepTime: '10 mins',
    cookTime: '5 mins',
  },
  // Add more recipe objects here
];

const RecipeCard = ({ recipe }) => {
  const starRating = Math.round(recipe.rating * 2) / 2;

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2 flex justify-center text-center lg:text-left xl:text-left">
      <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
        <div className="relative">
          <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover transform transition duration-300 ease-in-out hover:scale-105" />
          <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 pb-0.5 rounded">
            {/* <span className="text-xs font-medium">{recipe.category}</span> */}
            <span className="text-xs font-medium">{recipe.cookTime}<FontAwesomeIcon icon={faClock} className={'ml-1 text-xs'}/></span>
          </div>
          <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded">
            <span className="text-xs flex items-center">
              {starRating.toFixed(1)}  <FontAwesomeIcon icon={faStar} className={'ml-1 text-xs'}/>
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="font-bold text-lg mb-2">{recipe.title}</div>
          <p className="text-gray-700 text-sm line-clamp-3">{recipe.description}</p>
          <div className="flex justify-between mt-4">
            <div className="text-gray-600 text-xs">Prep Time: {recipe.prepTime}</div>
            <div className="text-gray-600 text-xs">{recipe.category}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendingRecipes = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
};

export default TrendingRecipes;