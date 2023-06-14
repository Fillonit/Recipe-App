import React, { useState, useEffect } from 'react';
import ChefCard from './ChefCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEye, faSave, faStar, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const SingleRecipe = ({ recipe, setLike }) => {
  console.log(recipe);
  const totalCookTime = recipe.CookTime + recipe.PreparationTime;
  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState(recipe.Rating);

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
  };
  async function saveRecipe() {
    try {
      const response = await fetch(`http://localhost:5000/api/recipe/save/${recipe.RecipeId}`, {
        method: "POST",
        headers: {
          "R-A-Token": localStorage.getItem('token'),
        }
      });
      if (response.status !== 201) return;
      setIsSaved(true);
    } catch (error) {
      console.log(error);
    }
  }
  async function unsaveRecipe() {
    try {
      const response = await fetch(`http://localhost:5000/api/recipe/save/${recipe.RecipeId}`, {
        method: "DELETE",
        headers: {
          "R-A-Token": localStorage.getItem('token'),
        }
      });
      if (response.status !== 204) return;
      setIsSaved(false);
    } catch (error) {
      console.log(error);
    }
  }
  const handleRatingClick = (newRating) => {
    setRating(newRating);
    const stars = document.querySelectorAll('.fa-star');
    stars.forEach((star, index) => {
      if (index < newRating) {
        star.classList.add('text-yellow-400');
        star.classList.remove('text-gray-400');
      } else {
        star.classList.add('text-gray-400');
        star.classList.remove('text-yellow-400');
      }
    });
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('text-yellow-400');
        star.classList.remove('text-gray-400');
      } else {
        star.classList.add('text-gray-400');
        star.classList.remove('text-yellow-400');
      }
    });
  };

  return (
    <div className="mt-32 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8">
          <img src={recipe.ImageUrl} alt={recipe.Title} className="w-full h-64 object-cover rounded-lg shadow-md mb-4" />
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black to-transparent">
            <h2 className="text-3xl font-bold text-white">{recipe.Title}</h2>
            <div className="flex items-center mt-2">
              <FontAwesomeIcon icon={faEye} className="text-gray-200 mr-1" />
              <span className="text-gray-300">{recipe.Views}</span>
              <FontAwesomeIcon icon={faSave} className={`text-gray-200 ml-4 mr-1 cursor-pointer ${isSaved ? 'text-green-500' : ''}`} onClick={() => {
                if (isSaved === true) unsaveRecipe();
                else saveRecipe()
              }} />
              <span className="text-gray-300" onClick={() => {
                if (isSaved === true) unsaveRecipe();
                else saveRecipe()
              }}>{isSaved ? 'Saved' : 'Save'}</span>
              <FontAwesomeIcon icon={faClock} className="text-gray-200 ml-4 mr-1" />
              <span className="text-gray-300">Total time: {totalCookTime} min (prep: {recipe.PreparationTime} min)</span>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg px-4 py-6">
          <div className="flex items-center justify-between">
            <ChefCard chef={recipe} />
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className={`text-gray-400 mr-1 cursor-pointer ${rating >= 1 ? 'text-yellow-400' : ''}`} onClick={() => handleRatingClick(1)} />
              <FontAwesomeIcon icon={faStar} className={`text-gray-400 mr-1 cursor-pointer ${rating >= 2 ? 'text-yellow-400' : ''}`} onClick={() => handleRatingClick(2)} />
              <FontAwesomeIcon icon={faStar} className={`text-gray-400 mr-1 cursor-pointer ${rating >= 3 ? 'text-yellow-400' : ''}`} onClick={() => handleRatingClick(3)} />
              <FontAwesomeIcon icon={faStar} className={`text-gray-400 mr-1 cursor-pointer ${rating >= 4 ? 'text-yellow-400' : ''}`} onClick={() => handleRatingClick(4)} />
              <FontAwesomeIcon icon={faStar} className={`text-gray-400 mr-1 cursor-pointer ${rating >= 5 ? 'text-yellow-400' : ''}`} onClick={() => handleRatingClick(5)} />
              <span className="text-gray-600">{rating}</span>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-600 block">{recipe.Description}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h3>
              <ul className="list-disc list-inside text-gray-600">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="mb-2">{ingredient.Name}({ingredient.Amount}{ingredient.UnitName.toLowerCase()})</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h3>
              <ol className="list-decimal list-inside text-gray-600">
                {recipe.steps.map((instruction, index) => (
                  <li key={index} className="mb-2">{instruction.StepDescription}</li>
                ))}
              </ol>
            </div>
            <div className="flex items-center mt-4">
              <h1 className="mr-2">{recipe.Likes}</h1>
              <button
                className={`px-4 py-2 text-white rounded ${recipe.AlreadyLiked === true ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                onClick={() => setLike(recipe.AlreadyLiked)}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Nutrition</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Protein: {recipe.Proteins} g</li>
                <li>Calories: {recipe.Calories} kcal</li>
                <li>Fats: {recipe.Fats} g</li>
                <li>Carbs: {recipe.Carbs} g</li>
              </ul>
            </div>
          </div>
          {/* <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Calories</h3>
          <p className="text-gray-600 block">{recipe.Calories}</p>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default SingleRecipe;