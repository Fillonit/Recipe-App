import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // Dummy user data
  const user = {
    name: 'John Doe',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder URL for profile picture
    favoriteRecipes: [
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
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto my-8 text-center">
        <img src={user.profilePicture} alt="Profile Picture" className="rounded-full w-32 h-32 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <h2 className="text-xl text-gray-500 mb-8">Favorite Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {user.favoriteRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white p-4 rounded-lg shadow-md">
              <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover mb-4" />
              <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
              <p className="text-gray-500">{recipe.description}</p>
            </div>
          ))}
        </div>
        <Link to="/" className="inline-block mt-8 text-indigo-500 underline">Go back to home</Link>
      </div>
    </div>
  );
};

export default ProfilePage;
