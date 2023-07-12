import React from "react";
import EditRecipeForm from "./EditRecipeForm";
import Ingredients from "./Recipe/Ingredients";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function EditRecipe() {
    const { id } = useParams();
    const [units, setUnits] = useState({});
    const [ingredients, setIngredients] = useState({});
    const [tags, setTags] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [recipe, setRecipe] = useState({});
    const [selectedIngredient, setSelectedIngredient] = useState(0);
    const [steps, setSteps] = useState([]);
    const [recipeIngredients, setRecipeIngredients] = useState({});
    const [recipeTags, setRecipeTags] = useState({});
    console.log("RECIPEINGREDIENTS");
    console.log(recipeIngredients);
    console.log("INGREDIENTS");
    console.log(ingredients);
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
        console.log("unit json");
        console.log(unitJson);
        for (const element of ingredientJson.response)
            ingredientObj[element.IngredientId] = element;
        for (const element of unitJson.response)
            unitObj[element.Unit] = element;
        if (unitResponse.status === 200 || unitResponse.status === 304) setUnits(unitObj);
        if (ingredientResponse.status === 200 || ingredientResponse.status === 304) {
            console.log("ingredient object");
            console.log(ingredientObj);
            setIngredients(ingredientObj);
            setSelectedIngredient(ingredientJson.response.length !== 0 ? ingredientJson.response[0] : {});;
        }
        if (tagResponse.status === 200 || tagResponse.status === 304) setTags(tagJson.response);
        if (cuisineResponse.status === 200 || cuisineResponse.status === 304) setCuisines(cuisineJson.response);
    }
    async function setRecipeData() {
        try {
            const response = await fetch(`http://localhost:5000/api/recipe/${id}`, {
                method: "GET",
                headers: {
                    'R-A-Token': localStorage.getItem('token')
                }
            });
            if (response.status !== 200) return;
            const json = await response.json();
            const steps = [];
            for (const step of json.response[3])
                steps.unshift(step.StepDescription);
            const ingredientObj = {}, tagObj = {};
            for (const ingredient of json.response[1])
                ingredientObj[ingredient.RecipeId] = { unit: ingredient.Unit, amount: ingredient.Amount };
            for (const tag of json.response[2])
                tagObj[tag.TagId] = tag.Name;
            setRecipeIngredients(ingredientObj);
            setRecipeTags(tagObj);
            setSteps(steps);
            setRecipe(json.response[0][0]);
            console.log("------------------------");
            console.log(tagObj);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        setComponents();
        setRecipeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="w-full h-full flex mt-36 items-center justify-start">
            <EditRecipeForm id={id} recipe={recipe} recipeIngredients={recipeIngredients} steps={steps}
                cuisines={cuisines} addStep={addStep} addIngredient={addIngredient}
                tags={tags} recipeTags={recipeTags} setRecipeTags={setRecipeTags}
                ingredients={ingredients} units={units} ingredientChange={ingredientChange}
                selectedIngredient={selectedIngredient} />
            <Ingredients steps={steps} setSteps={setSteps} setRecipeIngredients={setRecipeIngredients} units={units} ingredients={ingredients} recipeIngredients={recipeIngredients} />
        </div>
    );
}