import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';

const recipes = [
  {
    Title: 'Spicy Garlic Shrimp',
    ImageUrl: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    Description: 'A mouthwatering dish with a kick of spice and garlic.',
    Rating: 4.5,
    Cuisine: 'Seafood',
    PreparationTime: '30 mins',
    CookTime: '15 mins',
    Views: 100
  },
  {
    Title: 'Avocado Toast',
    ImageUrl: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    Description: 'A classic breakfast recipe with a twist of creamy avocado.',
    Rating: 5,
    Cuisine: 'Breakfast',
    PreparationTime: '10 mins',
    CookTime: '5 mins',
    Views: 100
  },
  {
    Title: 'Spicy Garlic Shrimp',
    ImageUrl: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    Description: 'A mouthwatering dish with a kick of spice and garlic.',
    Rating: 4.5,
    Cuisine: 'Seafood',
    PreparationTime: '30 mins',
    CookTime: '15 mins',
    Views: 100
  },
  {
    Title: 'Avocado Toast',
    ImageUrl: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    Description: 'A classic breakfast recipe with a twist of creamy avocado.',
    Rating: 5,
    Cuisine: 'Breakfast',
    PreparationTime: '10 mins',
    CookTime: '5 mins',
    Views: 100
  }
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
    <div className="flex justify-evenly flex-wrap">
      {data.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
      <div className='w-full h-24 flex justify-center items-center'>
        <h2 onClick={seeMore} className={'hover:cursor-pointer text-xl border-indigo-300 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase'}>See more?</h2>
      </div>
    </div>
  );
};

export default TrendingRecipes;