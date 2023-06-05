import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RandomRecipePage = () => {
  const [numOfRecipes, setNumOfRecipes] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    const fetchNumOfRecipes = async () => {
      const response = await fetch('/api/numOfRecipes');
      const data = await response.json();
      setNumOfRecipes(data.numOfRecipes || 10);
      setIsLoading(false);
    };
    fetchNumOfRecipes();
  }, []);

  const getRandomIndex = () => {
    return Math.floor(Math.random() * numOfRecipes);
  };

  useEffect(() => {
    if (!isLoading) {
      const randomIndex = getRandomIndex();
      history(`/recipe/${randomIndex}`);
    }
  }, [isLoading, history, numOfRecipes]);

  return (
    <div>
      {isLoading ? (
        <h1>Loading number of recipes...</h1>
      ) : (
        <h1>Loading random recipe...</h1>
      )}
    </div>
  );
};

export default RandomRecipePage;