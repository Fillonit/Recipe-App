import React from 'react';
import RecipeList from './components/RecipeList';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProfilePage from './components/ProfilePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';

const recipes = [
  {
    id: 1,
    title: 'Spaghetti with Tomato Sauce',
    image: 'https://www.giallozafferano.com/images/228-22832/spaghetti-with-tomato-sauce_1200x800.jpg',
    description: 'Classic spaghetti with tomato sauce and parmesan cheese.',
  },
  {
    id: 2,
    title: 'Garlic Butter Shrimp',
    image: 'https://www.jocooks.com/wp-content/uploads/2021/09/garlic-butter-shrimp-1-10.jpg',
    description: 'Juicy shrimp cooked in garlic butter and served with rice.',
  },
  {
    id: 3,
    title: 'Beef and Broccoli Stir-Fry',
    image: 'https://www.dinneratthezoo.com/wp-content/uploads/2017/10/beef-and-broccoli-stir-fry-14.jpg',
    description: 'Tender beef and crispy broccoli in a savory sauce.',
  },
];

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
