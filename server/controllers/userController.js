const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { errorHandler } = require("../middleware/errorMiddleware.js");
const { search } = require('../routes/adminRoutes.js');
const dotenv = require('dotenv').config();

const {
    MSSQL_DATABASE_NAME,
    MSSQL_SERVER_NAME,
    MSSQL_DRIVER,
    TOKEN_KEY,
    SALT
} = process.env;

const config = {
    database: MSSQL_DATABASE_NAME,
    server: MSSQL_SERVER_NAME,
    driver: MSSQL_DRIVER,
    options: {
        trustedConnection: true
    }
};

const tokenKey = process.env.TOKEN_KEY;

const salt = SALT, iterations = 1000, keylen = 64, digest = "sha512";

// @desc: Get user from the database
// @route: GET /api/users/:id
// @access: Private
const getUser = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let username = null;
    let userToGet = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token expired" });
            return;
        }
        console.log(decoded);
        username = decoded.username;
        userToGet = decoded.userId;
    });
    if (req.params.id !== undefined) {
        userToGet = req.params.id;
    }

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
        const QUERY = `SELECT * 
                       FROM Users u
                         INNER JOIN Following f
                         ON f.UserId = u.UserId
                       WHERE u.UserId = @username;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred on our part" });
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "No such user was found." });
                return;
            }
            res.status(200).json({ message: "Successfully fetched user.", response: { ...result.recordset[0], UserId: result.recordset[0].UserId[0] } });
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
        res.status(400).json({ err: "No text" });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            errorHandler(err, req, res, "");
            return;
        }
        // const username = req.body.username, password = req.body.password;
        const { username, password } = req.body;
        console.log(username + ", " + password);
        const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
        const userQuery = `SELECT * FROM Users WHERE Username = '${username}' AND Password = '${hashedPassword}'`;
        const request = new sql.Request();
        request.query(userQuery, (err, result) => {
            if (err) {
                errorHandler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(401).json({ message: "Password doesn't match." });
                return;
            }
            const token = jwt.sign({ userId: result.recordset[0].UserId, username: result.recordset[0].Username, role: result.recordset[0].Role, exp: (Date.now()) / 1000 + 3 * (60 * 60) }, TOKEN_KEY);
            res.status(200).json({ message: "The log in process was successful.", auth: token, role: result.recordset[0].Role, accUsername: result.recordset[0].Username });
        });
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
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred in our part." });
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(401).json({ message: "The data provided conflicts with our database" });
                return;
            }
            res.status(204).json({ message: "Updated resource successfully." });
        })
    });
});

// @desc: Update user from the database
// @route: /api/users
// @access: Private
const updateUser = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let role = null, isValid = false;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
        role = decoded.role;
    });
    if (!isValid) return;
    if (role !== 'admin') {
        res.status(403).json({ message: "You are not authorized to access this resource." });
        return;
    }
    const { usernameToUpdate, username, password, description, email, name, profilePicture } = req.body;

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
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred in our part." });
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(401).json({ message: "The data provided conflicts with our database" });
                return;
            }
            res.status(204).json({ message: "Updated resource successfully." });
        })
    });
});

// @desc: Delete user from the database
// @route: DELETE /api/users
// @access: Private
const deleteUserr = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let username = null, isValid = false, role;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
        username = decoded.username;
        role = decoded.role
    })
    if (!isValid) return;
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
        const request = new sql.Request();
        const hashedPassword = password === undefined ? "" : crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
        request.input('password', sql.VarChar, hashedPassword);
        request.input('username', sql.VarChar, username);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                          DECLARE @Count INT;
                          
                          SELECT @Count = COUNT(*)
                          FROM Users
                          WHERE Username = @username AND Password = @password OR (Username = @username AND Role = 'admin');
                          
                          IF(@Count = 1)
                           BEGIN
                            DELETE FROM Users`;
        request.query(QUERY, (err, result) => {
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

        const QUERY = `INSERT INTO Users(Username, Password, Role, CreatedAt) VALUES(@username, @password, 'user', GETDATE());
                       DECLARE @UserId INT;

                       SELECT @UserId = UserId
                       FROM Users
                       WHERE Username = @username

                       INSERT INTO Following(UserId) VALUES(@UserId);`;

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
const rejectPromotionToChef = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You are not authorized to access this resource." });
            return;
        }
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    const { userToReject } = req.body;
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error ocurred in our part." });
            return;
        }
        const request = new sql.Request();
        request.input('@userId', sql.Int, userId);

        const QUERY = `BEGIN TRANSACTION;
                        BEGIN TRY
                         DECLARE @Count INT;
                         
                         SELECT @Count = COUNT(*)
                         FROM ChefApplications 
                         WHERE UserId = @userId

                         IF(@Count = 0)
                          BEGIN
                           DELETE FROM ChefApplications WHERE UserId = @userId;
                           
                           INSERT INTO Notifications(UserId, Content, ReceivedAt) VALUES (@userId, 'Your chef application was unfortunately rejected...', GETDATE());
                           DECLARE @NotificationCount INT;

                           SELECT @NotificationCount = COUNT(*)
                           FROM Notifications
                           WHERE UserId = @userId;

                           IF(@NotificationCount >= 20)
                           BEGIN 
                             DECLARE @EarliestNotification INT;
                             DECLARE @EarliestDate DATE;

                             SELECT @EarliestDate = MIN(ReceivedAt)
                             FROM Notifications;
                             
                             SELECT @EarliestNotification = NotificationId
                             FROM Notifications
                             WHERE ReceivedAt = @EarliestDate;

                             DELETE FROM Notifications
                             WHERE NotificationId = @EarliestNotification
                           END
                          END
                        END TRY`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred in our part." });
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(401).json({ message: "The data provided conflicts with our database" });
                return;
            }
            res.status(204).json({ message: "Deleted resource successfully." });
        })
    });
});
const promoteToChef = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You are not authorized to access this resource." });
            return;
        }
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    const { userToPromote, experience, worksAt } = req.body;
    if (isNaN(Number(userToPromote)) || Number(userToPromote) != Math.floor(Number(userToPromote))) {
        res.status(401).json({ message: "Expected integer for user id." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error ocurred in our part." });
            return;
        }
        const request = new sql.Request();
        request.input('@userId', sql.Int, userToPromote);
        request.input('@experience', sql.Float, experience);
        request.input('@worksAt', sql.VarChar, worksAt);

        const QUERY = `BEGIN TRANSACTION;
                        BEGIN TRY
                         DECLARE @Count INT;
                         
                         SELECT @Count = COUNT(*)
                         FROM Normal_User
                         WHERE UserId = @userId;

                         IF(@Count = 0)
                          BEGIN
                           INSERT INTO Chef(ChefId, Experience, WorksAt) VALUES (@userId, @experience, @worksAt);
                     
                           DELETE FROM Normal_User
                           WHERE NormalUserId = @userId;
                           
                           DELETE FROM ChefApplications
                           WHERE UserId = @userId;

                           UPDATE Users
                           SET Role = 'Chef'
                           WHERE UserId = @userId;

                           INSERT INTO Notifications(UserId, Content, ReceivedAt) VALUES (@userId,'Your chef application was successful, you are now a chef!', GETDATE());
                           DECLARE @NotificationCount INT;

                           SELECT @NotificationCount = COUNT(*)
                           FROM Notifications
                           WHERE UserId = @userId;
                           
                           IF(@NotificationCount >= 20)
                           BEGIN 
                             DECLARE @EarliestNotification INT;
                             DECLARE @EarliestDate DATE;

                             SELECT @EarliestDate = MIN(ReceivedAt)
                             FROM Notifications;
                             
                             SELECT @EarliestNotification = NotificationId
                             FROM Notifications
                             WHERE ReceivedAt = @EarliestDate;

                             DELETE FROM Notifications
                             WHERE NotificationId = @EarliestNotification
                           END
                          END
                        END TRY`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred in our part." });
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(401).json({ message: "The data provided conflicts with our database" });
                return;
            }
            res.status(200).json({ message: "Created resource successfully." });
        })
    });
});
const getUsers = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    const page = req.headers['page'];
    const pattern = req.headers['query'];
    const numberOfRows = req.headers['rows'];
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
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "Forbidden, you don't have access to this resource." });
            return;
        }
        isValid = true;
    })

    if (!isValid) return;
    if (pattern === undefined) {
        res.status(401).json({ message: "Expeted string for pattern but instead got undefined" });
        return;
    }
    if (isNaN(Number(page)) || page <= 0) {
        res.status(401).json({ message: "Expected integer for the page, instead got: " + (typeof page) });
        return;
    }
    sql.connect(config, (error) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }
        const request = new sql.Request();
        request.input('offset', sql.Int, (page - 1) * numberOfRows);
        request.input('pattern', sql.VarChar, pattern);
        const QUERY = `BEGIN TRANSACTION
                         BEGIN TRY
                          DECLARE @UserTable TABLE(
                            UserId INT,
                            Username VARCHAR(50),
                            Email VARCHAR(200),
                            RowNum INT
                          );
                          INSERT INTO @UserTable(UserId, Username, Email, RowNum)
                          SELECT UserId, Username, Email, ROW_NUMBER() OVER (ORDER BY UserId) AS RowNum
                          FROM Users
                          WHERE Role <> 'admin' AND Username LIKE CONCAT('%', @pattern, '%');
                          
                          SELECT UserId, Username, Email
                          FROM @UserTable
                          WHERE RowNum > @offset AND RowNum <= (@offset + 4);
                         END TRY
                         BEGIN CATCH
                           THROW;
                           ROLLBACK;
                         END CATCH;
                       COMMIT;`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordset });
        });
    })
});
const getAllUserData = asyncHandler(async (req, res) => {
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
    sql.connect(config, async (err) => {
        if (err) {
            errorHandler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        //get from other tables too, following, followers, favorites, etc.
        const QUERY = `SELECT * FROM Users WHERE Username = '${username}'`;
        const userQuery = `SELECT * FROM Users WHERE Username = '${username}'`;
        const followingQuery = `SELECT * FROM Following WHERE Username = '${username}'`;
        const followersQuery = `SELECT * FROM Followers WHERE Username = '${username}'`;
        const favoritesQuery = `SELECT * FROM Favorites WHERE Username = '${username}'`;
        const postsQuery = `SELECT * FROM Posts WHERE Username = '${username}'`;
        const commentsQuery = `SELECT * FROM Comments WHERE Username = '${username}'`;
        const likesQuery = `SELECT * FROM Likes WHERE Username = '${username}'`;

        await request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.status(200).json({ message: "Successfully retrieved resource.", data: result.recordset });
        });

        await request.query(userQuery, (err, result) => {
            if (err) {
                errorHandler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.status(200).json({ message: "Successfully retrieved resource.", data: result.recordset });
        }
        );
        await request.query(followingQuery, (err, result) => {
            if (err) {
                errorHandler(err, req, res, "");
                return;
            }
            res.status(200).json({ message: "Successfully retrieved resource.", data: result.recordset });
        }
        );
        await request.query(followersQuery, (err, result) => {
            if (err) {
                errorHandler(err, req, res, "");
                return;
            }
            res.status(200).json({ message: "Successfully retrieved resource.", data: result.recordset });
        }
        );
    });
});

const editUsers = asyncHandler(async (req, res) => {
    //edit users data including role
    const token = req.body.auth;
    let adminUsername = null;
    let adminRole = null;
    let isValid = false;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        adminUsername = decoded.username;
        adminRole = decoded.role;
        isValid = true;
    })
    if (!isValid) {
        res.status(401).json({ message: "Token is invalid" });
        return;
    }
    const userToEdit = req.params.id;
    if (isNaN(userToEdit)) {
        res.status(400).json({ message: "Invalid id." });
        return;
    }
    const { username, password, email, role } = req.body;
    if (!username || !password || !email || !role) {
        res.status(400).json({ message: "Invalid data." });
        return;
    }
    if (role !== "Admin" && role !== "Normal" && role !== "Chef") {
        res.status(400).json({ message: "Invalid role." });
        return;
    }
    if (role === "Admin" && adminRole !== "Admin") {
        res.status(401).json({ message: "You are not authorized to do this." });
        return;
    }

    sql.connect(config, async (err) => {
        if (err) {
            errorHandler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        const QUERY = `UPDATE Users SET Username = '${username}', Password = '${password}', Email = '${email}', Role = '${role}' WHERE UserId = ${userToEdit}`;
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(err, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.status(204).json({ message: "Updated resource successfully." });
        })
    });
});

module.exports = {
    getUsers,
    register,
    getUser,
    setUser,
    editUser,
    deleteUserr,
    logUserIn,
    updateUser
};