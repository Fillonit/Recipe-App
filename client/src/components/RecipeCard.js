import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClock, faEye, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
const RecipeCard = ({ recipe, index, setRecipes }) => {
    const starRating = recipe.Rating != null ? (Math.round(recipe.Rating * 2) / 2).toFixed(1) : 'None';
    const [isSaved, setIsSaved] = useState(recipe.IsSaved === 1);
    const [optionsDisplayed, setOptionsDisplayed] = useState(false);
    async function deleteRecipe() {
        try {
            const response = await fetch(`http://localhost:5000/api/recipe/${recipe.RecipeId}`, {
                method: "DELETE",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            if (response.status != 204) return;
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
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
            setIsSaved(true);
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
            setIsSaved(false);
            console.log(error);
        }
    }

    function displayOptions() {
        setOptionsDisplayed(prev => !prev);
    }
    return (
        <div className="w-50 mb-8 flex justify-center text-center lg:text-left xl:text-left">
            <div className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white border-2 border-t  border-slate-950-500">
                <div className='relative flex justify-between items-center w-full'>
                    <div className='m-2 max-w-max pl-2 pr-2 pt-1 pb-1 h-auto flex items-center justify-start'>
                        <img src={recipe.ChefImage} className='w-10 h-10 rounded-full border-2 border-t border-slate-950' />
                        <h1 className='ml-2 cursor-pointer'><a href={`/users/${recipe.ChefId}`}>@{recipe.Username}</a></h1>
                    </div>
                    {localStorage.getItem('role') == 'admin' || localStorage.getItem('userId') == recipe.ChefId && <div>
                        {optionsDisplayed && <div style={{ transform: "translate(-100%, -10%)" }} className='absolute w-20 h-12 bg-gray-100 rounded-lg overflow-hidden'>
                            <div className='flex justify-center items-center bg-gray-200 h-1/2 hover:bg-gray-400 w-full cursor-pointer' onClick={deleteRecipe}>DELETE</div>
                            <div className='flex justify-center items-center bg-gray-200 h-1/2 hover:bg-gray-400  w-full cursor-pointer'>EDIT</div>
                        </div>}
                        <div onClick={displayOptions} className='mr-3 cursor-pointer w-6 h-8 flex flex-col items-center rounded-full hover:bg-gray-300 justify-evenly'>
                            <div className='rounded-full bg-black h-1 w-1'></div>
                            <div className='rounded-full bg-black h-1 w-1'></div>
                            <div className='rounded-full bg-black h-1 w-1'></div>
                        </div>
                    </div>}
                </div>
                <div className="relative min-h-40">
                    <img src={recipe.ImageUrl} style={{ width: "500px" }} className="min-h-40 h-40 object-cover transform transition duration-300 ease-in-out hover:scale-105" />
                    <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 pb-0.5 rounded">
                        {/* <span className="text-xs font-medium">{recipe.category}</span> */}
                        <span className="text-xs font-medium">{recipe.CookTime}<FontAwesomeIcon icon={faClock} className={'ml-1 text-xs'} /></span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-white to-white text-indigo-600 px-2 pb-0.5 rounded">
                        {/* <span className="text-xs font-medium">{recipe.Views}</span> */}
                        <span className={'text-xs font-medium'}>{recipe.Views} < FontAwesomeIcon className='ml-1' icon={faEye} /></span>
                    </div>
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded">
                        <span className="text-xs flex items-center">
                            {starRating}  <FontAwesomeIcon icon={faStar} className={'ml-1 text-xs'} />
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <div className='flex justify-between w-full'>
                        <h2 className="font-bold text-lg mb-2"><a href={`/recipe/${recipe.RecipeId}`} >{recipe.Title}</a></h2>
                        <FontAwesomeIcon onClick={() => {
                            if (isSaved === false) saveRecipe();
                            else unsaveRecipe();
                        }} icon={faBookmark} className={isSaved === true ? "stroke-indigo-500 text-indigo-500 hover:text-indigo-700 hover:cursor-pointer" : "stroke-gray-300 text-gray-300 hover:text-indigo-300 hover:cursor-pointer"} />
                    </div>
                    <div className='w-full flex align-center'>
                        <p className="text-gray-700 text-sm line-clamp-2">{recipe.Description}</p>
                    </div>
                    <div className="flex justify-between mt-2">
                        <div className="bg-indigo-400 text-white px-2 pb-0.5 rounded hover:bg-indigo-700 hover:cursor-pointer">
                            <span className="text-xs font-medium">Prep Time: {recipe.PreparationTime}<FontAwesomeIcon icon={faClock} className={'ml-1 text-xs'} /></span>
                        </div>
                        <div className="text-gray-800 text-xs font-medium hover:cursor-pointer mt-2">{recipe.Cuisine}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RecipeCard;