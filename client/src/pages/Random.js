import { useEffect } from 'react';

const RandomRecipePage = () => {
  const fetchRandomRecipe = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recipe/randomRecipe');
      const data = await response.json();
      alert(data.response[0].RecipeId);
      window.location.href = `/recipe/${data.response[0].RecipeId}`;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  return (
    <div>
      <h1>Loading random recipe...</h1>
    </div>
  );
};

export default RandomRecipePage;