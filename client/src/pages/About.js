import React from 'react';
import { FaCheck } from 'react-icons/fa';
import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="bg-white h-max">
    <div className="flex flex-col items-center justify-center pt-32 h-screen">
        <Navbar/>
      <div className="w-full max-w-4xl p-8 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-indigo-600">About</h1>
        <div className="flex flex-col md:flex-row items-center">
          <img
            className="w-64 h-64 rounded-full mb-4 md:mb-0 md:mr-8"
            src="https://picsum.photos/200"
            alt="About"
          />
          <p className="text-lg mb-4">
            Welcome to our recipe app! Here you can find a wide variety of recipes
            from all around the world. Our goal is to provide you with easy-to-follow
            instructions and delicious meals. We hope you enjoy using our app!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <div className="p-4 bg-indigo-100 rounded-lg shadow-md flex items-center">
            <FaCheck className="text-indigo-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-bold mb-2 text-indigo-600">Easy to Use</h2>
              <p className="text-sm">
                Our app is designed to be user-friendly and easy to navigate.
              </p>
            </div>
          </div>
          <div className="p-4 bg-indigo-100 rounded-lg shadow-md flex items-center">
            <FaCheck className="text-indigo-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-bold mb-2 text-indigo-600">Variety of Recipes</h2>
              <p className="text-sm">
                We offer a wide variety of recipes from different cuisines.
              </p>
            </div>
          </div>
          <div className="p-4 bg-indigo-100 rounded-lg shadow-md flex items-center">
            <FaCheck className="text-indigo-500 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-bold mb-2 text-indigo-600">Delicious Meals</h2>
              <p className="text-sm">
                Our recipes are carefully selected to provide you with delicious meals.
              </p>
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Replace the content of these cards with information about your team members */}
          <div className="p-4 bg-indigo-100 rounded-lg shadow-md flex items-center">
            <img
              className="w-32 h-32 rounded-full mr-4"
              src="https://picsum.photos/100"
              alt="Team member 1"
            />
            <div>
              <h3 className="text-lg font-bold mb-1 text-indigo-600">Team Member 1</h3>
              <p>Role</p>
            </div>
          </div>
          <div className="p-4 bg-indigo-100 rounded-lg shadow-md flex items-center">
            <img
              className="w-32 h-32 rounded-full mr-4"
              src="https://picsum.photos/101"
              alt="Team member 2"
            />
            <div>
              <h3 className="text-lg font-bold mb-1 text-indigo-600">Team Member 2</h3>
              <p>Role</p>
            </div>
          </div>
        </div>
      </div>
        {/* <Footer/> */}
    </div>
    <div className="pb-8"/>
  </div>
  );
};

export default About;