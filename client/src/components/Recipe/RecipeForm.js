/* eslint-disable array-callback-return */
import React from 'react';
import { useRef } from 'react';
import RecipeTags from './RecipeTags';
export default function RecipeForm({ recipeIngredients, steps, cuisines, addStep, addIngredient, tags, recipeTags, setRecipeTags, ingredients, selectedIngredient, units, ingredientChange }) {
    const title = useRef(), description = useRef(), servings = useRef(), cookTime = useRef();
    const unit = useRef(), quantity = useRef(), currentStep = useRef(), prepTime = useRef(), cuisine = useRef(), image = useRef();
    async function publishRecipe() {
        try {
            const form = new FormData();
            let objString = '';
            for (const key in recipeIngredients)
                objString += `${key}-${recipeIngredients[key].amount}-${recipeIngredients[key].unit},`;
            form.append('title', title.current.value);
            form.append('description', description.current.value);
            form.append('servings', servings.current.value);
            form.append('cookTime', cookTime.current.value);
            form.append('preparationTime', prepTime.current.value);
            form.append('cuisineId', cuisine.current.value);
            form.append('steps', steps);
            form.append('ingredients', objString);
            form.append('tags', Object.keys(recipeTags));
            form.append('image', image.current.files[0]);

            const response = await fetch("http://localhost:5000/api/recipe/add", {
                method: "POST",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                },
                body: form
            });
            console.log(response.status);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <form style={{ width: "860px" }} className="bg-violet-200 flex shadow-md rounded px-8 pt-6 pb-8 ml-20 mb-4 h-350" encType='multipart/form-data'>
            <div className='w-1/2'>
                <div className="mb-4">
                    <input
                        ref={title}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Title"
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        ref={description}
                        className="max-h-44 min-h-22 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Description"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <input
                        ref={servings}
                        onChange={(e) => {
                            console.log(servings.current.value);
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        placeholder="Servings"
                    />
                </div>
                <div className="mb-4">
                    <input
                        onChange={(e) => {
                            console.log(cookTime.current.value);
                        }}
                        ref={cookTime}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        placeholder="Cook time (minutes)"
                    />
                </div>
                <div className="mb-4">
                    <input
                        ref={prepTime}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        placeholder="Preparation time (minutes)"
                    />
                </div>
                <div className="mb-4">
                    <input
                        ref={image}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="file"
                        name='image'
                        accept="image/*"
                    />
                </div>
                <div className="mb-4">
                    <select className="w-32 bg-white cursor-pointer border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500" ref={cuisine}>
                        {cuisines.map((item) => {
                            return <option value={item.CuisineId}>{item.Name}</option>
                        })}
                    </select>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        publishRecipe();
                    }}
                    className="w-full mt-2 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                >
                    Publish recipe
                </button>
            </div>
            <div className='w-1/2 ml-20'>
                <div className="mb-4">
                    <input
                        ref={quantity}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        placeholder='Ingredient quantity...'
                    />
                    <select ref={unit} className="w-24 mt-3 bg-white border cursor-pointer border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500">
                        {Object.keys(units).map((key) => {
                            if (units[key].UnitType === selectedIngredient.UnitType)
                                return <option value={units[key].Unit}>{units[key].UnitName}</option>
                        })}
                    </select>
                    <select className="w-24 ml-3 bg-white mt-3 border cursor-pointer border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500" onChange={(e) => {
                        ingredientChange(e.target.value);
                    }}>
                        {Object.keys(ingredients).map((item) => {
                            return <option value={item}>{ingredients[item].Name}</option>
                        })
                        }
                    </select>
                    <button className="w-32 ml-3 mt-2 py-2 text-sm px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600" onClick={(e) => {
                        e.preventDefault();
                        addIngredient(selectedIngredient.IngredientId, unit.current.value, quantity.current.value)
                    }}>Add ingredient</button>
                </div>
                <div className="mb-4">
                    <textarea
                        ref={currentStep}
                        className="max-h-44 min-h-22 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Add steps here..."
                    ></textarea>
                    <button className="w-32 text-sm mt-2 py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600" onClick={(e) => {
                        e.preventDefault();
                        addStep(currentStep.current.value);
                    }}>Add step</button>
                </div>
                <RecipeTags tags={tags} recipeTags={recipeTags} setRecipeTags={setRecipeTags} />
            </div>
        </form>
    );
}