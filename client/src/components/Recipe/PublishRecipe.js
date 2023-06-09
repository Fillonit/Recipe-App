import React from "react";
import RecipeForm from "./RecipeForm";
import Ingredients from "./Ingredients";
import { useEffect, useState } from "react";
export default function PublishRecipe() {
    const [units, setUnits] = useState({});
    const [ingredients, setIngredients] = useState({});
    const [tags, setTags] = useState([]);
    const [cuisines, setCuisines] = useState([]);

    const [selectedIngredient, setSelectedIngredient] = useState(0);
    const [steps, setSteps] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState({});
    const [recipeTags, setRecipeTags] = useState({});

    function addStep(description) {
        setSteps((prev) => {
            return [...prev, description];
        });
    }
    function addIngredient(id, unit, amount) {
        setRecipeIngredients((prev) => {
            return { ...prev, [id]: { unit: unit, amount: amount } };
        });
    }
    function ingredientChange(id) {
        setSelectedIngredient(ingredients[id]);
    }
    async function setComponents() {
        const unitResponse = await fetch("http://localhost:5000/api/units", {
            method: "GET",
            headers: {
                'R-A-Token': localStorage.getItem('token')
            }
        });
        const ingredientResponse = await fetch("http://localhost:5000/api/ingredients", {
            method: "GET",
            headers: {
                'R-A-Token': localStorage.getItem('token')
            }
        })
        const tagResponse = await fetch("http://localhost:5000/api/tags", {
            method: "GET",
            headers: {
                'R-A-Token': localStorage.getItem('token')
            }
        })
        const cuisineResponse = await fetch("http://localhost:5000/api/cuisines", {
            method: "GET",
            headers: {
                'R-A-Token': localStorage.getItem('token')
            }
        })
        const ingredientObj = {}, unitObj = {};
        const unitJson = await unitResponse.json();
        const ingredientJson = await ingredientResponse.json();
        const tagJson = await tagResponse.json();
        const cuisineJson = await cuisineResponse.json();
        console.log(cuisineJson);
        for (const element of ingredientJson.response)
            ingredientObj[element.IngredientId] = element;
        for (const element of unitJson.response)
            unitObj[element.Unit] = element;
        if (unitResponse.status === 200) setUnits(unitObj);
        if (ingredientResponse.status === 200) {
            setIngredients(ingredientObj);
            setSelectedIngredient(ingredientJson.response.length !== 0 ? ingredientJson.response[0] : {});;
        }
        if (tagResponse.status === 200) setTags(tagJson.response);
        if (cuisineResponse.status === 200) setCuisines(cuisineJson.response);
    }
    useEffect(() => {
        setComponents();
    }, []);
    return (
        <div className="w-full h-full  flex mt-36 items-center justify-start">
            <RecipeForm recipeIngredients={recipeIngredients} steps={steps} cuisines={cuisines} addStep={addStep} addIngredient={addIngredient} tags={tags} recipeTags={recipeTags} setRecipeTags={setRecipeTags} ingredients={ingredients} units={units} ingredientChange={ingredientChange} selectedIngredient={selectedIngredient} />
            <Ingredients steps={steps} setSteps={setSteps} setRecipeIngredients={setRecipeIngredients} units={units} ingredients={ingredients} recipeIngredients={recipeIngredients} />
        </div>
    );
}