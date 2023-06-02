import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';

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

const TrendingRecipes = () => {
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(2);
  async function setComponents() {
    try {
      const response = await fetch(`http://localhost:5000/api/recipe/trending`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token'),
          'rows': 8,
          'page': 1
        }
      });
      if (response.status !== 200) return;
      const json = await response.json();
      console.log(json);
      setData(json.response);
    } catch (error) {
      console.log(error);
    }
  }
  async function seeMore() {
    try {
      const response = await fetch(`http://localhost:5000/api/recipe/trending`, {
        method: "GET",
        headers: {
          'R-A-Token': localStorage.getItem('token'),
          'rows': 8,
          'page': nextPage
        }
      });
      if (response.status !== 200) return;
      const json = await response.json();
      setData(prev => [...prev, ...json.response]);
      setNextPage(prev => prev + 1);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    setComponents();
  }, [])
  return (
    <div className="flex flex-wrap justify-center">
      {data.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
      <div className='w-full h-24 flex justify-center items-center'>
        <h2 onClick={seeMore}>See more</h2>
      </div>
    </div>
  );
};

export default TrendingRecipes;