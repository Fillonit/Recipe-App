import React from "react";

const HeroPage = () => {
  return (
    <div className="bg-indigo-500 mt-2 h-screen flex items-center justify-center bg-[url('https://img.freepik.com/free-photo/ingredients-homemade-tarte-tatin-pie-with-apples-nuts-beige-background-french-apple-pie-selective-focus_127032-2805.jpg?w=2000')]">
      
      <div className="max-w-lg px-6 text-center text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-500">Welcome to RecipeApp</h1>
        <p className="text-xl mb-8 text-indigo-500">Explore and discover delicious recipes!</p>
        <button className="bg-white text-indigo-500 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-100 hover:text-indigo-600 transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroPage;