const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const jwt = require('jsonwebtoken');
const { errorHandler } = require("../middleware/errorMiddleware.js");
const dotenv = require('dotenv').config();

const {
    MSSQL_DATABASE_NAME,
    MSSQL_SERVER_NAME,
    MSSQL_DRIVER,
    TOKEN_KEY,
    SALT
} = process.env;

const config = {
    database: 'Recipes',
    server: 'DESKTOP-8HBAVK7',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

const getCuisines = asyncHandler(async (req, res) => {
    const token = req.headers[`r-a-token`];

    let isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have permission to add this resource." });
            return;
        }
        isValid = true;
    })
    if (!isValid) return;

    sql.connect(config, (error) => {
        if (error) {
            errorHandler(error, req, res, "");
            return;
        }
        const QUERY = "SELECT * FROM Cuisine";
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordset });
        });
    })
});

const addCuisine = asyncHandler(async (req, res) => {
    const token = req.headers[`r-a-token`];

    let isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have permission to add this resource." });
            return;
        }
        isValid = true;
    })
    if (!isValid) return;

    const { title, description, servings, cookTime, preparationTime, ingredients, steps, tags } = req.body;
    const { image } = req.files;

    const imageName = image.name;
    const imagePath = `images/${imageName}`;

    const recipe = { 
        title, 
        description,
        servings,
        cookTime,
        preparationTime,
        ingredients,
        steps,
        tags,
        imagePath
    };

    sql.connect(config, (error) => {
        if (error) {
            errorHandler(error, req, res, "");
            return;
        }

        const QUERY = `INSERT INTO Recipe (title, description, servings, cookTime, preparationTime, ingredients, steps, tags, imagePath) VALUES ('${title}', '${description}', '${servings}', '${cookTime}', '${preparationTime}', '${ingredients}', '${steps}', '${tags}', '${imagePath}')`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            image.mv(`./uploads/${imageName}`, (err) => {
                if (err) {
                    errorHandler(error, req, res, "");
                    return;
                }
                res.status(200).json({ message: "Resource added successfully.", response: recipe });
            })
        });
    });
});

const deleteCuisine = asyncHandler(async (req, res) => {
    const token = req.headers[`r-a-token`];

    let isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have permission to add this resource." });
            return;
        }
        isValid = true;
    })
    if (!isValid) return;

    const { id } = req.params;

    sql.connect(config, (error) => {
        if (error) {
            errorHandler(error, req, res, "");
            return;
        }
        const QUERY = `DELETE FROM Recipe WHERE id = ${id}`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            res.status(200).json({ message: "Resource deleted successfully.", response: result.recordset });
        });
    })
});

const updateCuisine = asyncHandler(async (req, res) => {
    const token = req.headers[`r-a-token`];

    let isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;   
        }

        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have permission to add this resource." });
            return;
        }
        isValid = true;
    })
    if (!isValid) return;

    const { id } = req.params;
    const { title, description, servings, cookTime, preparationTime, ingredients, steps, tags } = req.body;
    const { image } = req.files;

    const imageName = image.name;
    const imagePath = `images/${imageName}`;

    const recipe = {
        title,
        description,
        servings,
        cookTime,
        preparationTime,
        ingredients,
        steps,
        tags,
        imagePath
    };

    sql.connect(config, (error) => {
        if (error) {
            errorHandler(error, req, res, "");
            return;
        }

        const QUERY = `UPDATE Recipe SET title = '${title}', description = '${description}', servings = '${servings}', cookTime = '${cookTime}', preparationTime = '${preparationTime}', ingredients = '${ingredients}', steps = '${steps}', tags = '${tags}', imagePath = '${imagePath}' WHERE id = ${id}`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            image.mv(`./uploads/${imageName}`, (err) => {
                if (err) {
                    errorHandler(error, req, res, "");
                    return;
                }
                res.status(200).json({ message: "Resource updated successfully.", response: recipe });
            })
        });
    });
});


module.exports = {
    getCuisines
}