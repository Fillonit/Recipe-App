import React from 'react';

const ChefCard = ({ chef }) => {
  return (
    <div className="flex items-center">
      <img src={chef.ProfilePicture} alt={chef.Username} className="w-12 h-12 object-cover rounded-full shadow-md" />
      <div className="ml-4">
        <p className="text-gray-800 font-bold">{chef.Username}</p>
        <p className="text-gray-600">{chef.Cuisine}</p>
      </div>
    </div>
  );
};

export default ChefCard;