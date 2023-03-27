import React from 'react';
import RecipeList from './components/RecipeList';

const recipes = [
  {
    id: 1,
    title: 'Spaghetti with Tomato Sauce',
    image: 'https://images.unsplash.com/photo-1600382529853-cf25995b8f79',
    description: 'Classic spaghetti with tomato sauce and parmesan cheese.',
  },
  {
    id: 2,
    title: 'Garlic Butter Shrimp',
    image: 'https://images.unsplash.com/photo-1620623438759-56db068b45fc',
    description: 'Juicy shrimp cooked in garlic butter and served with rice.',
  },
  {
    id: 3,
    title: 'Beef and Broccoli Stir-Fry',
    image: 'https://images.unsplash.com/photo-1620008463743-3d0bde1b06cf',
    description: 'Tender beef and crispy broccoli in a savory sauce.',
  },
];

function App() {
  return (
    <div className="container mx-auto my-8">
      <h1 className="text-4xl font-bold mb-8">Recipes</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default App;
