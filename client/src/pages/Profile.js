import React from 'react';
// import RecipeList from './components/RecipeList';
import Navbar from '../components/Navbar';
// import Hero from './components/Hero';
// import ProfilePage from '../components/ProfilePage';


// function App() {
//   return (
//     <div>
//       <Navbar />
//         <ProfilePage />
//     </div>
//   );
// }

// export default App;

const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-100 pt-32">
      <Navbar />
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-800">My Profile</h2>
        <div className="flex items-center justify-center mt-4">
          <img
            className="w-24 h-24 rounded-full"
            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            alt="Profile"
          />
        </div>
        <div className="mt-4">
          <label className="block text-indigo-700">Name</label>
          <input
            className="w-full px-3 py-1 mt-1 text-indigo-700 border rounded-lg focus:outline-none focus:ring"
            type="text"
            value="John Doe"
          />
        </div>
        <div className="mt-4">
          <label className="block text-indigo-700">Email</label>
          <input
            className="w-full px-3 py-1 mt-1 text-indigo-700 border rounded-lg focus:outline-none focus:ring"
            type="email"
            value="john.doe@example.com"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button className="px-3 py-1 text-white bg-indigo-800 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring">
            Save
          </button>
          <button className="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:ring">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile