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
    database: 'Recipes',
    server: 'DESKTOP-8HBAVK7',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};
const followers = asyncHandler(async (req, res, next) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
        userId = decoded.userId
        isValid = true;
    });
    if (!isValid) return;

    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        const QUERY = `SELECT wd.DaysAgo, COALESCE(COUNT(f.FolloweeId),0) AS Followers
                       FROM WeekDays wd
                         LEFT JOIN Followers f
                         ON (f.FolloweeId = @userId AND DATEDIFF(DAY, CONVERT(DATE, f.CreatedAt), CONVERT(DATE, GETDATE())) = wd.DaysAgo)
                       GROUP BY wd.DaysAgo
                       ORDER BY wd.DaysAgo DESC;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                responses.serverError(res);
                return;
            }
            // res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordsets });
            responses.resourceFetched(res, result.recordset);
            return;
        })
    })
});
const views = asyncHandler(async (req, res, next) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
        userId = decoded.userId
        isValid = true;
    });
    if (!isValid) return;

    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        const QUERY = `SELECT wd.DaysAgo, COALESCE(SUM(rv.Views), 0) AS Views
                       FROM WeekDays wd
                         LEFT JOIN Recipes r
                         ON r.ChefId = @userId 
                            LEFT JOIN RecipeViews rv
                            ON (rv.RecipeId = r.RecipeId AND DATEDIFF(DAY, CONVERT(DATE, rv.ViewedAt), CONVERT(DATE, GETDATE())) = wd.DaysAgo)
                       GROUP BY wd.DaysAgo
                       ORDER BY wd.DaysAgo DESC;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                responses.serverError(res);
                return;
            }
            // res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordsets });
            responses.resourceFetched(res, result.recordset);
            return;
        })
    })
});
const likes = asyncHandler(async (req, res, next) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
        userId = decoded.userId
        isValid = true;
    });
    if (!isValid) return;

    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        console.log(userId);
        const QUERY = `SELECT wd.DaysAgo, COALESCE(COUNT(l.LikeId),0) AS Likes
                       FROM WeekDays wd
                          LEFT JOIN Recipes r
                          ON r.ChefId = @userId
                            LEFT JOIN Likes l
                            ON (r.RecipeId = l.RecipeId AND DATEDIFF(DAY, CONVERT(DATE, l.CreatedAt), CONVERT(DATE, GETDATE())) = wd.DaysAgo)
                       GROUP BY wd.DaysAgo
                       ORDER BY wd.DaysAgo DESC;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                responses.serverError(res);
                return;
            }
            // res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordsets });
            responses.resourceFetched(res, result.recordset);
            return;
        })
    })
});
const comments = asyncHandler(async (req, res, next) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
        userId = decoded.userId
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        const QUERY = `SELECT wd.DaysAgo, COALESCE(COUNT(c.CommentId),0) AS Comments
                       FROM WeekDays wd
                          LEFT JOIN Recipes r
                          ON r.ChefId = @userId 
                            LEFT JOIN Comments c
                            ON (r.RecipeId = c.RecipeId AND DATEDIFF(DAY, CONVERT(DATE, c.CreatedAt), CONVERT(DATE, GETDATE())) = wd.DaysAgo)
                       GROUP BY wd.DaysAgo 
                       ORDER BY wd.DaysAgo DESC;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                responses.serverError(res);
                return;
            }
            // res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordsets });
            responses.resourceFetched(res, result.recordset);
            return;
        })
    })
});
const likeUserRatio = asyncHandler(async (req, res, next) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
        userId = decoded.userId
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        const QUERY = `SELECT SUM(s.Users) AS Users
                       FROM (SELECT vc.RecipeId, COUNT(DISTINCT vc.UserId) AS Users
                       FROM Recipes r
                          JOIN ViewCooldowns vc
                          ON vc.RecipeId = r.RecipeId
                          WHERE r.ChefId = @userId
                       GROUP BY vc.RecipeId)s;

                       SELECT COALESCE(COUNT(l.LikeId), 0) AS Likes
                       FROM Recipes r
                             JOIN Likes l
                             ON l.RecipeId = r.RecipeId
                       WHERE r.ChefId = @userId`;

        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                responses.serverError(res);
                return;
            }
            // res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordsets });
            responses.resourceFetched(res, result.recordsets);
            return;
        })
    })
});
module.exports = {
    followers,
    comments,
    likes,
    views,
    likeUserRatio
}