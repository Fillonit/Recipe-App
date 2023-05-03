const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const handler = require("../middleware/errorMiddleware.js");

const config = {
    database: 'Recipes',
    server: 'DESKTOP-8HBAVK7',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

const tokenKey = "TEST";

const salt = 'magnoliadev', iterations = 1000, keylen = 64, digest = "sha512";

// @desc: Get all users from the database
// @route: GET /api/users
// @access: Private
const getUsers = asyncHandler(async (req, res) => {
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
    })
    sql.connect(config, (error) => {
        if (error) {
            handler(error, req, res, "");//im not sure what next is
            return;
        }
        const QUERY = "SELECT * FROM Users";
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            const object = result.recordset[0];
            res.status(200).json({ result: object });
        });
    })
});

// @desc: Get user from the database
// @route: GET /api/users/:id
// @access: Private


// @desc: Set user from the database
// @route: POST /api/users
// @access: Private
const setUser = asyncHandler(async (req, res) => {

    if (!req.body.username || !req.body.password) {
        res.status(400);
        throw new Error('No text');
    }
    res.status(200).json({
        msg: 'Set user!'
    });
});
const logUserIn = asyncHandler(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400);
        throw new Error('No text');
    }
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const username = req.body.username, password = req.body.password;
        const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
        const userQuery = `SELECT * FROM Users WHERE Username = '${username}' AND Password = '${hashedPassword}'`;
        const request = new sql.Request();
        let userType, userId;
        request.query(userQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(401).json({ message: "Password doesn't match." });
                return;
            }
            userId = result.recordset[0].UserId;
            userType = result.recordset[0].userType; //<= more joins are required but this is just the general idea.
        });
        const token = jwt.sign({ userId: userId, username: username, role: userType, exp: (Date.now()) / 1000 + 3 * (60 * 60) }, tokenKey);
        res.status(200).json({ message: "The log in process was successful.", auth: token });
    })
});
// @desc: Update all users from the database
// @route: PUT /api/users
// @access: Private
const updateUser = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let username = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        username = decoded.username;
    });
});

// @desc: Delete user from the database
// @route: DELETE /api/users
// @access: Private
const deleteUser = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let username = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        username = decoded.username;
    })
    if (!req.body.password) {
        req.status(400).json({ message: "Password not provided." });
        return;
    }
    const password = req.body.password;
    sql.connect(config, async (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
        const userQuery = `SELECT * FROM Users WHERE Username = '${username}' AND Password = '${hashedPassword}'`;
        const request = new sql.Request();

        await request.query(userQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(401).json({ message: "Password doesn't match." });
                return;
            }
        });
        const deleteQuery = `DELETE FROM Users WHERE Username = '${username}'`;
        await request.query(deleteQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.status(204).json({ message: "User deleted successfully." });
        })
    });
});

module.exports = {
    getUsers,
    setUser,
    updateUser,
    deleteUser,
    logUserIn
};