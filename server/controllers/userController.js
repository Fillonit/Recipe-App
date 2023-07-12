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
    let userId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token expired" });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    const userToGet = req.params.id;
    if (isNaN(Number(userToGet)) || Math.floor(Number(userToGet)) != Number(userToGet)) {
        res.status().json({ message: "Expected integer for user id, instead got: " + (typeof userToGet) });
    }
    console.log(userToGet);
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
        request.input('userToGet', sql.Int, userToGet);
        request.input('currentUserId', sql.Int, userId);
        console.log(userId, userToGet);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         DECLARE @CanFollow BIT;
                         DECLARE @IsFavorite BIT;

                         SET @IsFavorite = CASE WHEN(SELECT COUNT(*) FROM ChefFavorites
                                                WHERE UserId = @currentUserId AND ChefId = @userToGet) = 1 THEN 1 ELSE 0 END;
                         SET @CanFollow = CASE WHEN(SELECT COUNT(*)
                           FROM Followers f
                           WHERE f.FollowerId = @currentUserId AND f.FolloweeId = @userToGet OR @currentUserId = @userToGet) >= 1 THEN 0 ELSE 1 END;

                         SELECT u.*, f.FollowingCount, ch.FollowersCount, @CanFollow AS CanFollow, @IsFavorite AS IsFavorite
                         FROM Users u
                           LEFT JOIN Following f
                           ON f.UserId = u.UserId
                            LEFT JOIN Chef ch
                            ON ch.ChefId = f.UserId
                         WHERE u.UserId = @userToGet;
                         
                        END TRY
                        BEGIN CATCH
                          THROW;
                          ROLLBACK;
                        END CATCH;
                       COMMIT;`;
        console.log("I AM HERE");
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred on our part" });
                console.log(err);
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "No such user was found." });
                return;
            }
            console.log(result.recordset)
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
        console.log(hashedPassword)
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
            try {
                const token = jwt.sign({ userId: result.recordset[0].UserId, username: result.recordset[0].Username, role: result.recordset[0].Role, exp: (Date.now()) / 1000 + 3 * (60 * 60) }, TOKEN_KEY);
                res.status(200).json({ message: "The log in process was successful.", auth: token, role: result.recordset[0].Role, userId: result.recordset[0].UserId, accUsername: result.recordset[0].Username });
            } catch (error) {
                console.log(error);
            }
        });
    })
});
// @desc: User self-edit data
// @route: PUT /api/users
// @access: Private
const editUser = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, role = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        userId = decoded.userId;
        role = decoded.role;
    });
    const { username, password, description, email, name } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error ocurred in our part." });
            return;
        }
        const hashedPassword = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
        const request = new sql.Request();
        request.input(`username`, sql.VarChar, username);
        request.input(`description`, sql.VarChar, description);
        request.input(`name`, sql.VarChar, name);
        request.input(`email`, sql.VarChar, email);
        request.input(`password`, sql.VarChar, hashedPassword);
        request.input(`userId`, sql.Int, userId)
        if (req.file !== undefined) request.input(`imageUrl`, sql.VarChar, `http://localhost:5000/images/${req.file.filename}`);
        const QUERY = ` DECLARE @CanEdit BIT;
                           
                        SELECT @CanEdit = CASE WHEN (SELECT COUNT(*)
                                                     FROM Users
                                                     WHERE UserId = @userId AND Password = @password) = 1 THEN 1 ELSE 0 END;
                        IF(@CanEdit = 1)
                        BEGIN
                          UPDATE Users
                          SET Username = @username, Description = @description, Name = @name${req.file !== undefined ? ", ProfilePicture = @imageUrl" : ""}
                          WHERE UserId = @userId;
                        END`;
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
    if (req.body === undefined || req.body === null || req.body === "") {
        res.status(401).json({ message: "Body property not included in the request." });
        console.log("req.body undefined");
        return;
    }
    // const username = req.body.username, password = req.body.password;
    const {
        username,
        password,
        description,
        fullName,
        email
    } = req.body;
    const imageName = req.file == undefined ? "https://wallpapers.com/images/hd/blank-default-pfp-wue0zko1dfxs9z2c.jpg" : req.file.filename;
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
        request.input('email', sql.VarChar, email);
        request.input('description', sql.VarChar, description);
        request.input('fullName', sql.VarChar, fullName);
        request.input('imageUrl', sql.VarChar, `http://localhost:5000/images/${imageName}`)
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         INSERT INTO Users(Username, Password, Role, CreatedAt, Description, Name, Email, ProfilePicture)
                         VALUES(@username, @password, 'user', GETDATE(), @description, @fullName, @email, @imageUrl);

                         DECLARE @UserId INT; 

                         SELECT @UserId = UserId
                         FROM Users
                         WHERE Username = @username;

                         INSERT INTO Following(UserId) VALUES(@UserId);
                         INSERT INTO Normal_User(UserId) VALUES(@UserId);
                        END TRY
                        BEGIN CATCH
                         THROW;
                         ROLLBACK;
                        END CATCH;
                       COMMIT;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "A mistake happened on our part.", err: err });
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
        request.input('rows', sql.Int, numberOfRows);
        const QUERY = `   SELECT UserId, Username, Email
                          FROM Users
                          WHERE Role <> 'admin' AND Username LIKE CONCAT('%', @pattern, '%')
                          ORDER BY UserId
                          OFFSET @offset ROWS
                          FETCH NEXT @rows ROWS ONLY`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            console.log(result.recordset);
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
const markChefAsFavorite = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        if (decoded.role == 'admin') {
            res.status(403).json({ message: "Forbidden, you don't have access to this resource." });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    })
    if (!isValid) return;
    sql.connect(config, (error) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }
        const request = new sql.Request();
        const chefId = req.params.id;
        request.input('userId', sql.Int, userId);
        request.input('chefId', sql.Int, chefId);
        const QUERY = `DECLARE @CanFavorite BIT;
                       SET @CanFavorite = CASE WHEN(SELECT COUNT(*) 
                                                    FROM Followers
                                                    WHERE FollowerId = @userId AND FolloweeId = @chefId) = 1 THEN 1 ELSE 0 END;
                       IF(@CanFavorite = 1)
                       BEGIN
                          INSERT INTO ChefFavorites(UserId, ChefId) VALUES(@userId, @chefId);
                       END`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            console.log(result.rowsAffected);
            res.status(201).json({ message: "Resource created successfully.", response: result.recordset });
        });
    })
});
const unmarkChefAsFavorite = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        if (decoded.role == 'admin') {
            res.status(403).json({ message: "Forbidden, you don't have access to this resource." });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    })
    if (!isValid) return;
    sql.connect(config, (error) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }
        const request = new sql.Request();
        const chefId = req.params.id;
        request.input('userId', sql.Int, userId);
        request.input('chefId', sql.Int, chefId);
        const QUERY = `DELETE FROM ChefFavorites WHERE ChefId = @chefId AND UserId = @userId`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            console.log("Chef favorited rows affected")
            console.log(result.rowsAffected);
            res.status(204).json({ message: "Resource deleted successfully.", response: result.recordset });
        });
    })
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

const changePassword = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, role = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        userId = decoded.userId;
        role = decoded.role;
    });
    const { currentPassword, newPassword } = req.body;
    console.log(req.body);
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error ocurred in our part." });
            return;
        }
        const request = new sql.Request();
        const hashedOldPassword = crypto.pbkdf2Sync(currentPassword, salt, iterations, keylen, digest).toString('hex');
        const hashedNewPassword = crypto.pbkdf2Sync(newPassword, salt, iterations, keylen, digest).toString('hex');
        request.input('userId', sql.VarChar, userId);
        request.input('oldPassword', sql.VarChar, hashedOldPassword);
        request.input('newPassword', sql.VarChar, hashedNewPassword);
        const QUERY = `DECLARE @CanChange BIT;
                        
                       SET @CanChange = CASE WHEN (SELECT COUNT(*)
                                                   FROM Users
                                                   WHERE UserId = @userId AND Password = @oldPassword) = 1 THEN 1 ELSE 0 END;
                       IF(@CanChange = 1)
                       BEGIN 
                         UPDATE Users
                         SET Password = @newPassword
                         WHERE UserId = @userId;
                       END`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred in our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(401).json({ message: "The data provided conflicts with our database" });
                return;
            }
            res.status(200).json({ message: "Updated resource successfully." });
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
    updateUser,
    markChefAsFavorite,
    unmarkChefAsFavorite,
    changePassword
};