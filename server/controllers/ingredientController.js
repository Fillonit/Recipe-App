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

const getIngredients = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];

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
        const QUERY = "SELECT * FROM Ingredients";
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

const getIngredient = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    const id = req.params.id;

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
        const QUERY = `SELECT * FROM Ingredients WHERE id = ${id}`;
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

const addIngredient = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    const { name, description, image } = req.body;

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
        const QUERY = `INSERT INTO Ingredients (name, description, image) VALUES ('${name}', '${description}', '${image}')`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            res.status(201).json({ message: "Resource added successfully." });
        });
    })
});

const updateIngredient = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    const id = req.params.id;
    const { name, description, image } = req.body;

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
        const QUERY = `UPDATE Ingredients SET name = '${name}', description = '${description}', image = '${image}' WHERE id = ${id}`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            res.status(200).json({ message: "Resource updated successfully." });
        });
    })
});

const deleteIngredient = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    const id = req.params.id;

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
        const QUERY = `DELETE FROM Ingredients WHERE id = ${id}`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            res.status(200).json({ message: "Resource deleted successfully." });
        });
    })
});

module.exports = {
    getIngredients,
    getIngredient,
    addIngredient,
    updateIngredient,
    deleteIngredient
}