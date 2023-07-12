const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
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
    database: MSSQL_DATABASE_NAME,
    server: MSSQL_SERVER_NAME,
    driver: MSSQL_DRIVER,
    options: {
        trustedConnection: true
    }
};

const usersIncrease = asyncHandler(async (req, res) => {
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
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You do not have permission to get this resource." });
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
        const QUERY = `BEGIN TRANSACTION
                         BEGIN TRY
                           DECLARE @UsersThisWeek INT;
                           DECLARE @UsersLastWeek INT;
                           DECLARE @Percentage FLOAT;

                           SELECT @UsersThisWeek = COUNT(*)
                           FROM Users
                           WHERE CreatedAt > DATEADD(DAY, -7, GETDATE());
                           
                           SELECT @UsersLastWeek = COUNT(*)
                           FROM Users
                           WHERE CreatedAt > DATEADD(DAY, -7, GETDATE()) AND CreatedAt < DATEADD(DAY, -14, GETDATE());
                           
                           SET @Percentage = CASE WHEN
                           @UsersLastWeek = 0 THEN 0
                           ELSE ((CAST(@UsersThisWeek AS DECIMAL(10, 2))/@UsersLastWeek)-1)*100 END;
 
                           SELECT @Percentage AS Percentage, @UsersThisWeek AS Count
                           FROM Units
                           WHERE Unit = 'KG'; --The unit kg doesnt have anything to do with the query, but i just need to only include one row for the result.
                         END TRY
                         BEGIN CATCH
                           THROW;
                           ROLLBACK;
                         END CATCH;
                       COMMIT;`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: err });
                console.log(err);
                return;
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordset });
        });
    })
});
const recipeIncrease = asyncHandler(async (req, res) => {
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
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You do not have permission to get this resource." });
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
        const QUERY = `BEGIN TRANSACTION
                         BEGIN TRY
                           DECLARE @RecipesToday INT;
                           DECLARE @RecipesYesterday INT;
                           DECLARE @Percentage FLOAT;

                           SELECT @RecipesToday = COUNT(*)
                           FROM Recipes
                           WHERE CreatedAt > DATEADD(MINUTE, -2, GETDATE());
                           
                           SELECT @RecipesYesterday = COUNT(*)
                           FROM Recipes
                           WHERE CreatedAt < DATEADD(MINUTE, -2, GETDATE()) AND CreatedAt > DATEADD(MINUTE, -4, GETDATE());
                           
                           SET @Percentage = CASE WHEN
                           @RecipesYesterday = 0 THEN 0
                           ELSE ((CAST(@RecipesToday AS DECIMAL(10, 2))/@RecipesYesterday)-1)*100 END;
 
                           SELECT @Percentage AS Percentage, @RecipesToday AS Count
                           FROM Units
                           WHERE Unit = 'KG';
                         END TRY
                         BEGIN CATCH
                           THROW;
                           ROLLBACK;
                         END CATCH;
                       COMMIT;`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: err });
                console.log(err);
                return;
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordset });
        });
    })
});
const trafficIncrease = asyncHandler(async (req, res) => {
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
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You do not have permission to get this resource." });
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
        const QUERY = `BEGIN TRANSACTION
                         BEGIN TRY
                           DECLARE @RecipeLikesThisMonth INT;
                           DECLARE @CommentLikesThisMonth INT;
                           DECLARE @CommentsThisMonth INT;
                           DECLARE @RatingsThisMonth INT;
                           DECLARE @RecipeLikesLastMonth INT;
                           DECLARE @CommentLikesLastMonth INT;
                           DECLARE @CommentsLastMonth INT;
                           DECLARE @RatingsLastMonth INT;
                           DECLARE @TrafficThisMonth INT;
                           DECLARE @TrafficLastMonth INT;
                           DECLARE @Percentage FLOAT;

                           SELECT @RecipeLikesThisMonth = COUNT(*)
                           FROM Likes
                           WHERE CreatedAt > DATEADD(DAY, -30, GETDATE());
                           
                           SELECT @CommentLikesThisMonth = COUNT(*)
                           FROM CommentLikes
                           WHERE CreatedAt > DATEADD(DAY, -30, GETDATE());
                           
                           SELECT @CommentsThisMonth = COUNT(*)
                           FROM Comments
                           WHERE CreatedAt > DATEADD(DAY, -30, GETDATE());
                           
                           SELECT @RatingsThisMonth = COUNT(*)
                           FROM Ratings
                           WHERE CreatedAt > DATEADD(DAY, -30, GETDATE());
                           
                           SELECT @RecipeLikesLastMonth = COUNT(*)
                           FROM Likes
                           WHERE CreatedAt < DATEADD(DAY, -30, GETDATE());
                           
                           SELECT @CommentLikesLastMonth = COUNT(*)
                           FROM CommentLikes
                           WHERE CreatedAt < DATEADD(DAY, -30, GETDATE());

                           SELECT @CommentsLastMonth = COUNT(*)
                           FROM Comments
                           WHERE CreatedAt < DATEADD(DAY, -30, GETDATE());

                           SELECT @RatingsLastMonth = COUNT(*)
                           FROM Ratings
                           WHERE CreatedAt < DATEADD(DAY, -30, GETDATE());

                           SET @TrafficThisMonth = @RecipeLikesThisMonth + @CommentLikesThisMonth + @CommentsThisMonth + @RatingsThisMonth;
                           SET @TrafficLastMonth = @RecipeLikesLastMonth + @CommentLikesLastMonth + @CommentsLastMonth + @RatingsLastMonth;
                           
                           SET @Percentage = CASE WHEN
                           @TrafficLastMonth = 0 THEN 0
                           ELSE ((CAST(@TrafficThisMonth AS DECIMAL(10, 2))/@TrafficLastMonth)-1)*100 END;
 
                           SELECT @Percentage AS Percentage, @TrafficThisMonth AS Count
                           FROM Units
                           WHERE Unit = 'KG';
                         END TRY
                         BEGIN CATCH
                           THROW;
                           ROLLBACK;
                         END CATCH;
                       COMMIT;`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: err });
                console.log(err);
                return;
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordset });
        });
    })
});

const deleteUser = asyncHandler(async (req, res) => {
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
        isValid = true;
    })
    if (!isValid) return;

    const id = req.params.id;
    if (isNaN(Number(id))) {
        res.status(401).json({ message: "Expected integer for UserId, but instead got: " + (typeof id) });
        return;
    }
    sql.connect(config, async (err) => {
        if (err) {
            res.status(500).json({ message: "An error occurred on our part." });
            console.log(err);
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, Number(id));
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                          DECLARE @CanDelete BIT;
                          SET @CanDelete = CASE WHEN (SELECT COUNT(*) FROM Users WHERE UserId = @userId AND Role <>'admin') = 1 THEN 1 ELSE 0 END;
                          IF(@CanDelete)
                           BEGIN
                           UPDATE Chef c
                           SET c.FollowersCount = c.FollowersCount - 1
                           WHERE (SELECT COUNT(*) 
                                 FROM Followers f
                                 WHERE @userId = f.FollowerId AND c.ChefId = f.FolloweeId);
                           DELETE FROM Likes WHERE UserId = @userId;
                           DELETE FROM CommentLikes WHERE UserId = @userId;
                           DELETE FROM Comments WHERE UserId = @userId;
                           DELETE FROM Likes WHERE RecipeId = @userId;
                           DELETE FROM Recipes WHERE ChefId = @userId;
                           DELETE FROM Followers WHERE FolloweeId = @userId;
                           DELETE FROM Saved WHERE UserId = @userId;
                           DELETE FROM Users WHERE UserId = @userId;
                           END
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
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.status(204).json({ message: "User deleted successfully." });
        })
    });
});

const editUser = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenInvalid(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        isValid = true;
    })
    if (!isValid) return;

    const id = req.params.id;
    if (isNaN(Number(id))) {
        res.status(401).json({ message: "Expected integer for UserId, but instead got: " + (typeof id) });
        return;
    }
    const { username, email, password, role } = req.body;
    if (username === undefined || email === undefined || password === undefined || role === undefined) {
        responses.inputsNotProvided(res);
        return;
    }
    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string') {
        res.status(400).json({ message: "Expected string for all fields." });
        return;
    }
    if (username.length < 3 || username.length > 20) {
        res.status(400).json({ message: "Username must be between 3 and 20 characters." });
        return;
    }
    if (email.length < 3 || email.length > 50) {
        res.status(400).json({ message: "Email must be between 3 and 50 characters." });
        return;
    }
    if (password.length < 3 || password.length > 50) {
        res.status(400).json({ message: "Password must be between 3 and 50 characters." });
        return;
    }
    if (role !== 'admin' && role !== 'user') {
        responses.tokenNoPermission(res);
        return;
    }
    sql.connect(config, async (err) => {
        if (err) {
            responses.serverError(res);
            console.log(err);
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, Number(id));
        request.input('username', sql.VarChar, username);
        request.input('email', sql.VarChar, email);
        request.input('password', sql.VarChar, password);
        request.input('role', sql.VarChar, role);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                            UPDATE Users SET Username = @username, Email = @email,
                            Password = @password, Role = @role WHERE UserId = @userId;
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
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "User not found." });
                return;
            }
            res.status(204).json({ message: "User updated successfully." });
        })
    });
});

const userChart = asyncHandler(async (req, res) => {
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
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You do not have permission to get this resource." });
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
        const QUERY = `SELECT wd.DaysAgo, COUNT(u.CreatedAt) AS Users
                       FROM WeekDays wd
                         LEFT JOIN Users u
                         ON DATEDIFF(DAY, CONVERT(DATE, u.CreatedAt), CONVERT(DATE, GETDATE())) = wd.DaysAgo
                       GROUP BY wd.DaysAgo;
                       SELECT Role, COUNT(*) AS Count
                       FROM Users 
                       GROUP BY Role
                       ORDER BY Role;`;
        const request = new sql.Request();
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: err });
                console.log(err);
                return;
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordsets });
        });
    })
});
module.exports = {
    usersIncrease,
    recipeIncrease,
    trafficIncrease,
    deleteUser,
    userChart
}