import React from 'react';
import { FaCheck } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-[93.33dvh] pt-16">
      <div className="container mx-auto px-4 pt-16">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">About</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2 text-indigo-600">Our Recipe App</h2>
            <p className="text-lg mb-4">
              Welcome to our recipe app! Here you can find a wide variety of recipes
              from all around the world. Our goal is to provide you with easy-to-follow
              instructions and delicious meals. We hope you enjoy using our app!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
              <div className="p-4 bg-white rounded-lg shadow-md flex items-center hover:bg-gray-100 transition-colors duration-300">
                <FaCheck className="text-indigo-500 text-3xl mr-4" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-indigo-600">Easy to Use</h3>
                  <p className="text-sm">
                    Our app is designed to be user-friendly and easy to navigate.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md flex items-center hover:bg-gray-100 transition-colors duration-300">
                <FaCheck className="text-indigo-500 text-3xl mr-4" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-indigo-600">Variety of Recipes</h3>
                  <p className="text-sm">
                    We offer a wide variety of recipes from different cuisines.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md flex items-center hover:bg-gray-100 transition-colors duration-300">
                <FaCheck className="text-indigo-500 text-3xl mr-4" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-indigo-600">Delicious Meals</h3>
                  <p className="text-sm">
                    Our recipes are carefully selected to provide you with delicious meals.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              className="w-full md:w-3/4 rounded-lg shadow-md"
              src="https://picsum.photos/1920/1080"
              alt="About"
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Replace the content of these cards with information about your team members */}
          <div className="p-4 bg-white rounded-lg shadow-md flex items-center hover:bg-gray-100 transition-colors duration-300">
            <img
              className="w-32 h-32 rounded-full mr-4"
              src="https://picsum.photos/1000"
              alt="Fillonit Ibishi"
            />
            <div>
              <h3 className="text-lg font-bold mb-1 text-indigo-600">Fillonit Ibishi</h3>
              <p>Role</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md flex items-center hover:bg-gray-100 transition-colors duration-300">
            <img
              className="w-32 h-32 rounded-full mr-4"
              src="https://picsum.photos/1000"
              alt="Arlind Zeqiri"
            />
            <div>
              <h3 className="text-lg font-bold mb-1 text-indigo-600">Arlind Zeqiri</h3>
              <p>Role</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;