const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const crypto = require("crypto");
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
    database: process.env.MSSQL_DATABASE_NAME,
    server: process.env.MSSQL_SERVER_NAME,
    driver: process.env.MSSQL_DRIVER,
    options: {
        trustedConnection: true
    }
};

const getTags = asyncHandler(async (req, res) => {
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
        const QUERY = "SELECT * FROM Tags";
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

const getTag = asyncHandler(async (req, res) => {
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
        const QUERY = `SELECT * FROM Tags WHERE id = ${id}`;
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

const addTag = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    const { name } = req.body;
    
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
        const QUERY = `INSERT INTO Tags (name) VALUES ('${name}')`;
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

const updateTag = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    const id = req.params.id;
    const { name } = req.body;

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
        const QUERY = `UPDATE Tags SET name = '${name}' WHERE id = ${id}`;
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

const deleteTag = asyncHandler(async (req, res) => {
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
        const QUERY = `DELETE FROM Tags WHERE id = ${id}`;
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
    getTags,
    getTag,
    addTag,
    updateTag,
    deleteTag
}