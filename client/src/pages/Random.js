import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RandomRecipePage = ({ recipes }) => {
  const numOfRecipes = recipes.length;
  const navigate = useNavigate();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * numOfRecipes);
    navigate(`/recipe/${randomIndex}`);
  }, [navigate, numOfRecipes]);

  return (
    <div>
      <h1>Loading random recipe...</h1>
    </div>
  );
};

export default RandomRecipePage;