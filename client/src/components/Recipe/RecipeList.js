import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} title={recipe.title} image={recipe.image} description={recipe.description} />
      ))}
    </div>
  );
};

export default RecipeList;
