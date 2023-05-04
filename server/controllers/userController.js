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

const tokenKey = process.env.TOKEN_KEY;

const salt = process.env.SALT, iterations = 1000, keylen = 64, digest = "sha512";

// @desc: Get all users from the database
// @route: GET /api/users
// @access: Private
const getUsers = asyncHandler(async (req, res) => {
    const token = req.body.auth;

    // getUsers osht GET request, pra nuk ka body, ka vetem params
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
            errorHandler(error, req, res, "");//im not sure what next is
            return;
        }
        const QUERY = "SELECT * FROM Users";
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
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
const getUser = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let username = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token expired" });
            return;
        }
        username = decoded.username;
    });
    const userToGet = req.params.id;
    if (isNaN(Number(userToGet))) {
        res.status(401).json({
            message: "Expected integer, instead got else"
        });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error ocurred on our part." });
            return;
        }
        const request = new sql.Request();
        request.input('username', sql.Int, userToGet);
        const QUERY = 'SELECT * FROM Users WHERE UserId = @username';

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred on our part" });
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "No such user was found." });
                return;
            }
            res.status(200).json({ message: "Successfully fetched user.", response: result.recordset[0] });
        });
    });
});
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
            errorHandler(err, req, res, "");
            return;
        }
        const username = req.body.username, password = req.body.password;
        const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
        const userQuery = `SELECT * FROM Users WHERE Username = '${username}' AND Password = '${hashedPassword}'`;
        const request = new sql.Request();
        let userType, userId;
        request.query(userQuery, (err, result) => {
            if (err) {
                errorHandler(err, req, res, "");
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
// @desc: User self-edit data
// @route: PUT /api/users
// @access: Private
const editUser = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let username = null, role = null;
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
        role = decoded.role;
    });
    const { usernameToUpdate, password, description, email, name, profilePicture } = req.body;

    if (usernameToUpdate === null || usernameToUpdate === undefined || usernameToUpdate === "" || password === null || password === undefined || password === "" || description === null || description === undefined || description === "" || email === null || email === undefined || email === "" || name === null || name === undefined || name === "" || profilePicture === null || profilePicture === undefined || profilePicture === "") {
        res.status(401).json({ message: "You are not authorized to do this." });
        return;
    }

    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error ocurred in our part." });
            return;
        }
        const request = new sql.Request();
        const QUERY = `
        UPDATE Users 
        SET Username = '${usernameToUpdate}', Password = '${password}', Description = '${description}', Email = '${email}', Name = '${name}', ProfilePicture = '${profilePicture}'
        WHERE Username = '${username}';`;
        request.query(QUERY, (err, result)=>{
            if (err) {
                res.status(500).json({ message: "An error ocurred in our part." });
                return;
            }
            if(result.rowsAffected === 0){
                res.status(401).json({message:"The data provided conflicts with our database"});
                return;
            }
            res.status(204).json({message: "Updated resource successfully."});
        })
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
            errorHandler(err, req, res, "");
            return;
        }
        const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
        const userQuery = `SELECT * FROM Users WHERE Username = '${username}' AND Password = '${hashedPassword}'`;
        const request = new sql.Request();

        await request.query(userQuery, (err, result) => {
            if (err) {
                errorHandler(err, req, res, "");
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
                errorHandler(err, req, res, "");
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

const register = asyncHandler(async (req, res) => {
    console.log("registered");
    if (req.body === undefined || req.body === null || req.body === "" || req.body === {} || req.body === []) {
        res.status(401).json({ message: "Body property not included in the request." });
        console.log("req.body undefined");
        return;
    }
    // const username = req.body.username, password = req.body.password;
    const {
        username,
        password,
        description,
        profilePicture,
        name,
        email
    } = req.body;

    if (typeof username != 'string' || typeof password != 'string') {
        console.log("req.body undefined");
        res.status(401).json({ message: "Expected both password and usernmae to be string, instead got: " + (typeof username) + ", and " + (typeof password) });
        return;
    }
    if (username.length > 30 || password.length > 30) {
        res.status(401).json({ message: "Username or password are too long." });
        console.log("username too long pass too long");
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            console.log("database connection failed.");
            return;
        }

        const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, 'sha512').toString('hex');
        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        request.input('password', sql.VarChar, hashedPassword);

        const QUERY = `INSERT INTO Users(Username, Password, Role) VALUES(@username, @password, 'user')`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "A mistake happened on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(400).json({ message: "Could not add the resource." });
                return;
            }
            res.status(201).json({ message: "Successfully created resource." });
        });
    })
});

const testError = asyncHandler(async (req, res, next) => {
    const err = new Error("This is a test error.");
    next(err);
});


module.exports = {
    getUsers,
    register,
    getUser,
    setUser,
    editUser,
    deleteUser,
    logUserIn,
    testError
};