const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { errorHandler } = require("../middleware/errorMiddleware.js");
const dotenv = require('dotenv').config();
const responses = require('../responses');

const {
    MSSQL_DATABASE_NAME,
    MSSQL_SERVER_NAME,
    MSSQL_DRIVER,
    TOKEN_KEY,
    SALT
} = process.env;

const config = {
    database: process.env.MSSQL_DATABASE_NAME,
    server: process.env.MSSQL_SERVER_NAME,
    driver: process.env.MSSQL_DRIVER,
    options: {
        trustedConnection: true
    }
};

const initRecipes = asyncHandler(async (req, res) => {
    if(process.env.NODE_ENV === 'production') {
        responses.serverError(res, "This endpoint is not available in production");
        return;
    }

    // fetch data from https://www.themealdb.com/api/json/v1/1/random.php and insert into database
    // const fetch = require('node-fetch');
    const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
    const response = await fetch(url);
    const data = await response.json();
    const recipe = data.meals[0];
    const recipeName = recipe.strMeal;
    const recipeDescription = recipe.strInstructions;
    const recipeImage = recipe.strMealThumb;
    const recipeCuisine = recipe.strArea;
    const recipeTags = recipe.strTags;
    const recipeIngredients = [];
    const recipeUnits = [];
    const recipeQuantities = [];
    const recipeSteps = [];
    const recipeComments = [];
    const recipeChef = 1;
    const recipeDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    for (let i = 1; i <= 20; i++) {
        if (recipe[`strIngredient${i}`]) {
            recipeIngredients.push(recipe[`strIngredient${i}`]);
            recipeUnits.push(recipe[`strMeasure${i}`]);
        }
    }

    for (let i = 1; i <= 20; i++) {
        if (recipe[`strStep${i}`]) {
            recipeSteps.push(recipe[`strStep${i}`]);
        }
    }

    const pool = await sql.connect(config);
    const request = pool.request();
    // ,[Title]
    //   ,[Description]
    //   ,[ImageUrl]
    //   ,[PreparationTime]
    //   ,[CookTime]
    //   ,[Servings]
    //   ,[ChefId]
    //   ,[CreatedAt]
    //   ,[UpdatedAt]
    //   ,[Views]
    //   ,[Rating]
    //   ,[NumberOfRatings]
    //   ,[CuisineId]
    //   ,[AdminUpdatedAt]
    //   ,[Edited]
    request.input('recipeName', sql.NVarChar, recipeName);
    request.input('recipeDescription', sql.NVarChar, recipeDescription);
    request.input('recipeImage', sql.NVarChar, recipeImage);
    request.input('recipeCuisine', sql.NVarChar, recipeCuisine);
    request.input('recipeTags', sql.NVarChar, recipeTags);
    request.input('recipeChef', sql.Int, recipeChef);
    request.input('recipeDate', sql.DateTime, recipeDate);
    // const result = await request.query(`INSERT INTO Recipes (recipeName, recipeDescription, recipeImage, recipeCuisine, recipeTags, recipeChef) VALUES (@recipeName, @recipeDescription, @recipeImage, @recipeCuisine, @recipeTags, @recipeChef)`);
    const result = await request.query(`INSERT INTO Recipes (Title, Description, ImageUrl, CuisineId, ChefId, CreatedAt, PreparationTime, CookTime, Servings) VALUES (@recipeName, @recipeDescription, @recipeImage, 1, @recipeChef, @recipeDate, 0, 0, 3)`);
    const recipeId = result.recordset[0].recipeId;

    for (let i = 0; i < recipeIngredients.length; i++) {
        const request = pool.request();
        request.input('recipeId', sql.Int, recipeId);
        request.input('ingredientName', sql.NVarChar, recipeIngredients[i]);
        request.input('ingredientUnit', sql.NVarChar, recipeUnits[i]);
        const result = await request.query(`INSERT INTO Ingredients (recipeId, ingredientName, ingredientUnit) VALUES (@recipeId, @ingredientName, @ingredientUnit)`);
    }

    for (let i = 0; i < recipeSteps.length; i++) {
        const request = pool.request();
        request.input('recipeId', sql.Int, recipeId);
        request.input('stepDescription', sql.NVarChar, recipeSteps[i]);
        const result = await request.query(`INSERT INTO Steps (recipeId, stepDescription) VALUES (@recipeId, @stepDescription)`);
    }

    responses.success(res, "Recipe added successfully");
});  


module.exports = {
    initRecipes
}