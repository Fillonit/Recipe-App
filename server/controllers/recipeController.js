const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const handler = require("../middleware/errorMiddleware.js");
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
    const userId = token.userId;
    const isAdmin = token.role == "admin";
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const recipeId = req.body.recipeId;
        const deleteQuery = `DELETE FROM Recipes WHERE RecipeId = '${recipeId}'`
        const getQuery = `SELECT * FROM Recipes WHERE RecipeId = '${recipeId}'`;
        const request = new sql.Request();
        if (isAdmin) {
            request.query(deleteQuery, (err, result) => {
                if (err) {
                    handler(err, req, res, "");
                    return;
                }
                if (result.rowsAffected === 0) {
                    handler(err, req, res, "");
                    return;
                }
                res.status(204).json({message: "Recipe deleted successfully."});
            });
        }
        let recipePoster = null;
        request.query(getQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                handler(err, req, res, "");
                return;
            }
            recipePoster = result.recordset[0].poster;
        });
        if(recipePoster == userId){
            res.status(204).json({message:"Recipe deleted successfully"});
            return;
        }
        res.status(403).json({ message: "Unauthorized request, access denied."});
    })
});