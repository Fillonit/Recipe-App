import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-16 px-4 md:text-center">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0 mx-2 text-center">
            <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Discover Delicious Recipes
            </h2>
            <p className="mt-3 text-xl leading-normal text-white sm:mt-5 sm:text-2xl">
              Browse through a wide collection of mouthwatering recipes and unleash your culinary
              skills.
            </p>
            <div className="mt-8">
              <a
                href="/recipes"
                className="inline-block bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 hover:text-white transition duration-300"
              >
                Explore Recipes
              </a>
            </div>
          </div>
          <div className="mt-8 md:mt-0 md:ml-4">
            <img
              className="mx-auto h-64 w-64 object-cover rounded-full"
              src="https://cdn3d.iconscout.com/3d/premium/thumb/chef-avatar-6299542-5187874.png"
              alt="Hero"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
