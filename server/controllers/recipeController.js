const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const jwt = require('jsonwebtoken');
const handler = require("../middleware/errorMiddleware.js");
const mime = require('mime');

const config = {
    database: 'Recipes',//<= name of the database in sql
    server: 'DESKTOP-8HBAVK7', //<=name of your desktop device
    driver: 'msnodesqlv8',//<= stays the same
    options: {
        trustedConnection: true
    }
};

const deleteRecipe = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let userId, isAdmin;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
    });
    userId = token.userId;
    isAdmin = token.role == "admin";
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        const recipeId = req.body.recipeId;
        const commentIdQuery = `SELECT CommentId FROM Comments WHERE RecipeId = ${recipeId}`
        let commentIds = [];
        request.query(commentIdQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) return; //this just means that there are no comments so no need to include them;
            for (const element of result.recordset)
                commentIds.push(element.CommentId);
        });
        const getQuery = `SELECT ChefId FROM Recipes WHERE RecipeId = ${recipeId}`

        let deleteQuery = `
        BEGIN TRANSACTION
        DELETE FROM Recipes WHERE RecipeId = ${recipeId};
        DELETE FROM Comments WHERE RecipeId = ${recipeId};
        `;
        if (commentIds.length !== 0) queries += `DELETE FROM CommentLikes WHERE CommentId IN (${commentIds.join(", ")})`;
        queries += `COMMIT`;
        // const deleteQuery = queries;
        // const queries = [`BEGIN TRANSACTION`];
        // queries.push(`DELETE FROM Recipes WHERE RecipeId = ${recipeId}`);
        // queries.push(`DELETE FROM Comments WHERE RecipeId = ${recipeId}`);
        // if (commentIds.length !== 0) queries.push(`DELETE FROM CommentLikes WHERE CommentId IN (${commentIds.join(", ")})`);
        // queries.push(`COMMIT`);
        // const deleteQuery = queries.join("; ") + ";";

        if (isAdmin) {
            request.query(deleteQuery, (err, result) => {
                if (err) {
                    handler(err, req, res, "");
                    return;
                }
                if (result.rowsAffected === 0) {
                    res.status(204).json({ message: "Could not find resource." });
                    return;
                }
                res.status(204).json({ message: "Recipe deleted successfully." });
                return;
            });
        }
        let recipePoster = null;
        request.query(getQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
            recipePoster = result.recordset[0].ChefId;
        });
        if (recipePoster != userId) {
            res.status(403).json({ message: "Unauthorized request, access denied." });
            return;
        }
        request.query(deleteQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
            res.status(204).json({ message: "Recipe deleted successfully." });
            return;
        })
    })
});

const addRecipe = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let chefId;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (token.role === 'user') {
            res.status(403).json({ message: "Not authorized to add a recipe." });
            return;
        }
        chefId = token.userId;
    });
    /*req.body.ingredients = {
        (int)ingredientId: [(int)amount, (string)unitId]

        ** reminder that unitIds are "KG", "GR" etc**
    }*/
    /*req.body.steps = [step1, step2, step3 ...]*/
    const fileType = require('file-type');

    const title = req.body.title, description = req.body.description;
    const image = req.files.imageURL, ingredients = req.body.ingredients;
    const cookTime = req.body.cookTime, servings = req.body.servings;
    const steps = req.body.steps, prepTime = req.body.preparationTime;
    const cuisineId = req.body.cuisineId;

    if (title === undefined || description === undefined || image === undefined || ingredients === undefined
        || cookTime === undefined || servings === undefined || steps === undefined || prepTime === undefined || cuisineId === undefined) {
        res.status(400).json({ message: "Not all required information was provided." });
        return;
    }
    if (typeof ingredients != 'object' || !Array.isArray(steps)) {
        res.status(400).json({ message: "Information is not in the expected format." });
        return;
    }
    const type = fileType(image);
    if (!type || !type.mime.startsWith('image/')) {
        res.status(400).json({ message: "File is not an image." });
        return;
    }
    if (Object.keys(ingredients).length === 0 || title.length > 100 || description.length > 500 || cookTime < 0 || servings <= 0 || prepTime < 0) {
        res.status(400).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        const recipeIdQuery = `SELECT MAX(RecipeId) AS Max FROM Recipes`;
        let currentRecipeId = null;
        request.query(recipeIdQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                currentRecipeId = 1; //if the recordset length is 0,
                return               // it means that there are currently no rows
            }                  // so the id that will be assigned is 1.
            currentRecipeId = result.recordset[0].Max + 1;
        });
        const queries = [];
        const fileName = image.originalname;
        image.mv(`../uploads/${fileName}`, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
                return;
            }
            res.status(200).send('File uploaded successfully');
        });
        let queryList = `
        BEGIN TRANSACTION;
        INSERT INTO Recipes(Title, Description, ImageUrl, PreparationTime, CookTime, Servings, ChefId, CreatedAt, CuisineId) VALUES
        ('${title}','${description}','${imageURL}','${prepTime}','${cookTime}','${servings}','${cookTime}','${chefId}','${cuisineId}');
        `;
        for (const key in ingredients) {
            queryList += `
            INSERT INTO RecipeIngredients(RecipeId, IngredientId, Amount, Unit) VALUES
            ('${currentRecipeId}','${key}','${ingredients[key][0]}','${ingredients[key][1]}');
            `;
        }
        for (const element of steps) {
            queryList += `
            EXEC InsertOrUpdateRow @RecipeId = ${currentRecipeId}, @Description = ${element};
            `;
        }
        

        // queries.push(`INSERT INTO Recipes(Title, Description, ImageUrl, PreparationTime, CookTime, Servings, ChefId, CreatedAt, CuisineId) VALUES` +
        //     `('${title}','${description}','${imageURL}','${prepTime}','${cookTime}','${servings}','${cookTime}','${chefId}','${cuisineId}')`);
        // for (const key in ingredients) {
        //     queries.push(`INSERT INTO RecipeIngredients(RecipeId, IngredientId, Amount, Unit) VALUES` +
        //         `('${currentRecipeId}','${key}','${ingredients[key][0]}','${ingredients[key][1]}')`);
        // }
        // for (const element of steps) {
        //     queries.push(`EXEC InsertOrUpdateRow @RecipeId = ${currentRecipeId}, @Description = ${element}`);
        // }
        // queries.unshift(`BEGIN TRANSACTION`);
        // queries.push(`COMMIT`);
        const insertQuery = queries.join("; ") + ";";
        request.query(insertQuery, (err, res) => {
            if (err) {
                const fs = require('fs');
                const fp = `./uploads/${fileName}`;
                fs.unlink(fp, (err) => {
                    if (err) console.error(err);
                    else console.log(`Deleted file: ${fp}`);
                });
                handler(err, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                handler(err, req, res, "");
                return;
            }
            res.status(201).json({ message: "Recipe was successfully added." });
            return;
        });
    });
});
module.exports = {
    deleteRecipe,
    addRecipe
};