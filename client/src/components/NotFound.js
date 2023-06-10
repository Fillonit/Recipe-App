import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
      <div className="text-6xl text-white">
        <FontAwesomeIcon icon={faUtensils} />
      </div>
      <h1 className="text-4xl text-white font-bold my-4">Uh-oh! Recipe Not Found</h1>
      <p className="text-lg text-white">
        We're sorry, but the recipe you're looking for does not exist. Please check the URL or try another recipe.
      </p>
      <a
        href="/recipes"
        className="mt-6 px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
      >
        Explore More Recipes
      </a>
    </div>
  );
};

export default Error404;
