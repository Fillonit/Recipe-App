import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RandomRecipePage = () => {
  const [recipeId, setRecipeId] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomRecipe = async () => {
      const response = await fetch('http://localhost:5000/api/recipe/randomRecipe');
      const data = await response.json();
      setRecipeId(data[0].RecipeId);
    };

    fetchRandomRecipe();
  }, []);

  useEffect(() => {
    if (recipeId) {
      navigate(`/recipe/${recipeId}`);
    }
  }, [navigate, recipeId]);

  return (
    <div>
      <h1>Loading random recipe...</h1>
    </div>
  );
};

export default RandomRecipePage;