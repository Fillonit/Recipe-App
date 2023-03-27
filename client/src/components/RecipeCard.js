import React from 'react';

const RecipeCard = ({ title, image, description }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img className="h-48 w-full object-cover md:h-full md:w-48" src={image} alt={title} />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{title}</div>
          <p className="mt-2 text-gray-500">{description}</p>
          <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded">
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
