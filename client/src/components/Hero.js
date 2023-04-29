import React from "react";

const HeroPage = () => {
  return (
    <div className="mt-2 h-screen flex items-center m-0 p-0 justify-center bg-[url('https://img.freepik.com/free-photo/ingredients-homemade-tarte-tatin-pie-with-apples-nuts-beige-background-french-apple-pie-selective-focus_127032-2805.jpg?w=2000')]">
      
      <div className="max-w-lg px-6 text-center text-white bg-white p-10 m-10 rounded-3xl opacity-75 text-opacity-100">
        <h1 className="text-4xl font-bold mb-6 text-orange-800">Welcome to RecipeApp</h1>
        <p className="text-xl mb-8 text-orange-700 bg-blend-color-burn">Explore and discover delicious recipes!</p>
        <button className="bg-white text-orange-700 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-100 hover:text-indigo-600 transition duration-300 opacity-100 border border-orange-600">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroPage;