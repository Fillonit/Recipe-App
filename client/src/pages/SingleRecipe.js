import React, { useState, useEffect } from 'react';
// import ChefCard from '../components/ChefCard';
import SingleRecipe from '../components/SingleRecipe';

const recipe = {
    "ChefImage": "https://picsum.photos/800/600",
    "ChefId": 1,
    "Username": "Fillonit",
    "ImageUrl": "https://picsum.photos/800/600",
    "Title": "French Fries",
    "CookTime": 30,
    "Views": 20,
    "Rating": 5,
    "RecipeId": 1,
    "ProfilePicture": "https://picsum.photos/800/600",
    "Description": "French Fries are the best! They are so easy to make and taste delicious! I like to eat them with ketchup. Yum!",
    "PreparationTime": 15,
    "Cuisine": "French",
    "Ingredients": [
      "1 cup flour",
      "1/2 cup sugar",
      "1/2 cup milk",
      "1/4 cup butter",
      "1 egg",
      "1 tsp baking powder",
      "1/2 tsp salt"
    ],
    "Instructions": [
      "Preheat oven to 350°F.",
      "In a large bowl, cream together butter and sugar until light and fluffy.",
      "Beat in egg and milk.",
      "In a separate bowl, combine flour, baking powder, and salt.",
      "Gradually add dry ingredients to wet mixture, mixing until just combined.",
      "Pour batter into greased 9x9 inch baking dish.",
      "Bake for 25-30 minutes, or until golden brown and a toothpick inserted into the center comes out clean."
    ]
  };

const RecipePage = () => {
    const [recipeData, setRecipeData] = useState(null);
  
    useEffect(() => {
      fetch('/api/recipe/12')
        .then(response => response.json())
        .then(data => setRecipeData(data))
        .catch(error => console.error(error));
    }, []);
  
    return (
      <div>
        {recipeData ? (
          <SingleRecipe recipe={recipeData} />
        ) : (
          <SingleRecipe recipe={recipe} />
        )}
      </div>
    );
  };
  
  export default RecipePage;