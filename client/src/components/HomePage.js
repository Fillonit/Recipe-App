import React from 'react';
import RecipeList from './Recipe/RecipeList';
// import Navbar from './Navbar';
import Hero from './Hero';
// import ProfilePage from './ProfilePage';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Footer from './Footer';
// import Wave from './Wave';
// import Content from './Content';
import Trending from './Trending';

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
    <div className="-mt-2">
      {/* <Navbar /> */}
      <Hero />
      {/* <Wave /> */}
      <div className="relative">
        <div className="container mx-auto my-8">
          <h1 className="text-6xl pb-4 border-b-2 font-bold mb-6 flex justify-center text-indigo-500 border-indigo-300">Recipes</h1>
          <RecipeList recipes={recipes} />

          {/* <ProfilePage /> */}
          <Trending />
        </div>
      </div>
      {/* <Footer /> */}
    </div>

  );
}

// WaveAnimation component
//   const WaveAnimation = () => {
//     return (
//       <div className="w-full">
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 96" className="text-white">
//           <path fill="#4F46E5" fillOpacity="1" d="M0,0L1440,32L1440,96L0,96Z"></path>
//         </svg>
//       </div>
//     );
//   }

export default App;