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


const addComment = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let userId = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        userId = decoded.userId;
    });
    sql.connect(config, (error) => {
        if (error) {
            handler(error, req, res, ""); // im not sure what next is
            return;
        }
        const json = JSON.parse(req.body);
        const content = json.content, recipeId = json.recipeId;
        if (typeof content != 'string') {
            res.status(400).json({ message: "The content is not valid" });
            return;
        }
        if (content.length > 2000) {
            res.status(400).json({ message: "Comment is too long." });
        }

        const commentQuery = `INSERT INTO Comments (UserId, Content, RecipeId)` +
            `VALUES (${userId},'${content}',${recipeId})`;
        const request = new sql.Request();

        request.query(commentQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(500).json({ message: "Could not insert the resource." });
                return;
            }
        });
        res.status(201).json({ message: "Successfully added resource." });
    });
});
const deleteComment = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let userId = null, role = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
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
    sql.connect(config, (error) => {
        if (error) {
            handler(error, req, res, ""); // im not sure what next is
            return;
        }
        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(400).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        const queries = [`BEGIN TRANSACTION`];
        queries.push(`DELETE FROM Comments WHERE CommentId = ${commentId}`);
        queries.push(`DELETE FROM CommentLikes WHERE CommentId = ${commentId}`);
        queries.push(`COMMIT`);
        const commentQuery = queries.join("; ") + ";";
        const request = new sql.Request();
        if (role == 'admin') {
            request.query(commentQuery, (err, result) => {
                if (err) {
                    handler(err, req, res, "");
                    return;
                }
                if (result.rowsAffected === 0) {
                    res.status(404).json({ message: "Could not find resource." });
                    return;
                }
                res.status(204).json({ message: "Successfully deleted resource." });
            })
        }
        const userQuery = `SELECT UserId FROM Comments WHERE CommentId = ${commentId}`;
        request.query(userQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
            if (result.recordset.UserId != userId) {
                res.status(403).json({ message: "You don't have permission to delete that comment." });
                return;
            }
        });
        request.query(commentQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
        });
        res.status(204).json({ message: "Successfully deleted resource." });
    });
});
const likeComment = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let userId = null, role = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        userId = decoded.userId;
    });
    sql.connect(config, (error) => {
        if (error) {
            handler(error, req, res, ""); // im not sure what next is
            return;
        }

        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(400).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        const existsQuery = `SELECT COUNT(*) FROM CommentLikes WHERE CommentId = ${commentId} AND UserId = ${userId}`;
        const request = new sql.Request();

        request.query(existsQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length !== 0) {
                res.status(409).json({ message: "Conflict, user already liked the given comment." });
                return;
            }
        });
        const likeQuery = `INSERT INTO CommentLikes (CommentId, UserId) VALUES (${commentId}, ${userId})`;
        request.query(likeQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "Could not find comment." });
                return;
            }
        });
        res.status(201).json({ message: "Successfully added resource." });
    });
});
const unlikeComment = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let userId = null, role = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        userId = decoded.userId;
    });
    sql.connect(config, (error) => {
        if (error) {
            handler(error, req, res, ""); // im not sure what next is
            return;
        }

        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(400).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        const existsQuery = `SELECT COUNT(*) FROM CommentLikes WHERE CommentId = ${commentId} AND UserId = ${userId}`;
        const request = new sql.Request();

        request.query(existsQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "Could not find the liked resource." });
                return;
            }
        });
        const likeQuery = `DELETE FROM CommentLikes WHERE CommentId = (${commentId} AND UserId = ${userId})`;
        request.query(likeQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
        });
        res.status(204).json({ message: "Successfully deleted resource." });
    });
});

module.exports = {
    addComment,
    deleteComment,
    likeComment,
    unlikeComment
};