import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClock, faEye, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
const RecipeCard = ({ recipe }) => {
    const starRating = Math.round(recipe.rating * 2) / 2;
    const [isSaved, setIsSaved] = useState(recipe.IsSaved == 1);
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
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2 flex justify-center text-center lg:text-left xl:text-left">
            <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white">
                <div className="relative">
                    <img src={recipe.ImageUrl} alt={recipe.Title} style={{ width: "500px" }} className=" h-40 object-cover transform transition duration-300 ease-in-out hover:scale-105" />
                    <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 pb-0.5 rounded">
                        {/* <span className="text-xs font-medium">{recipe.category}</span> */}
                        <span className="text-xs font-medium">{recipe.CookTime}<FontAwesomeIcon icon={faClock} className={'ml-1 text-xs'} /></span>
                    </div>
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded">
                        <span className="text-xs flex items-center">
                            {starRating.toFixed(1)}  <FontAwesomeIcon icon={faStar} className={'ml-1 text-xs'} />
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <div className='flex justify-between w-full'>
                        <h2 className="font-bold text-lg mb-2">{recipe.Title}</h2>
                        <FontAwesomeIcon onClick={() => {
                            if (isSaved == false) saveRecipe();
                            else unsaveRecipe();
                        }} icon={faBookmark} color={isSaved == true ? "black" : "lightgray"} style={{ stroke: "black" }} />
                    </div>
                    <div className='w-full flex align-center'>
                        <p className="text-gray-700 text-sm line-clamp-3">{recipe.Description}</p>
                        <div className='flex flex-grow justify-end items-center'>
                            {recipe.Views} < FontAwesomeIcon className='ml-1' icon={faEye} />
                        </div>
                    </div>
                    <div className="flex justify-between mt-4">
                        <div className="text-gray-600 text-xs">Prep Time: {recipe.PreparationTime}</div>
                        <div className="text-gray-600 text-xs">{recipe.Cuisine}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RecipeCard;