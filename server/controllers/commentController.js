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
const tokenKey = process.env.TOKEN_KEY

const addComment = asyncHandler(async (req, res) => {
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
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    console.log(req.body)
    const comment = req.body.comment, recipeId = req.body.recipeId;
    console.log(comment);
    if (comment === undefined) {
        res.status(401).json({ message: "Comment content is not provided." });
        return;
    }
    sql.connect(config, (error) => {
        if (error) {
            res.status(500).json({ message: "An error happened on our part." })
            return;
        }
        if (comment.length > 2000) {
            res.status(401).json({ message: "Comment is too long." });
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('comment', sql.VarChar, comment);
        request.input('recipeId', sql.Int, recipeId);
        const commentQuery = `INSERT INTO Comments (UserId, Content, RecipeId, CreatedAt) VALUES (@userId, @comment, @recipeId, GETDATE());
                              DECLARE @CommentId INT;
                              SELECT @CommentId = MAX(CommentId) FROM Comments;
                              
                              SELECT c.Content, u.Username, c.Likes, c.CreatedAt, c.CommentId, c.Edited, 1 AS CanEdit, 0 AS AlreadyLiked 
                             FROM Comments c
                                JOIN Users u
                                ON u.UserId = c.UserId
                             WHERE CommentId = @commentId`;

        request.query(commentQuery, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." })
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(500).json({ message: "Could not insert the resource." });
                return;
            }
            res.status(201).json({ message: "Successfully added resource.", response: result.recordset });
        });
    });
});
const deleteComment = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false, role = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        role = decoded.role;
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, (error) => {
        if (error) {
            handler(error, req, res, "");
            return;
        }
        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(400).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('commentId', sql.Int, commentId);
        request.input('role', sql.VarChar, role);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         DECLARE @Count INT;
                         
                         SELECT @Count = COUNT(*)
                         FROM Comments 
                         WHERE @role = 'admin' OR(CommentId = @commentId AND UserId = @userId);

        IF(@Count > 0)
        BEGIN 
                           DELETE FROM Comments WHERE CommentId = @commentId;
        END
                        END TRY
                        BEGIN CATCH
        THROW;
        ROLLBACK;
                        END CATCH;
        COMMIT; `;
        request.query(QUERY, (err, result) => {
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
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid." });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired." });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." })
            return;
        }

        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(400).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('commentId', sql.Int, commentId);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         DECLARE @Count INT;

                         SELECT @Count = COUNT(*) 
                         FROM CommentLikes 
                         WHERE UserId = @userId AND CommentId = @commentId;

        IF(@Count = 0)
        BEGIN
                          INSERT INTO CommentLikes(UserId, CommentId, CreatedAt) VALUES(@userId, @commentId, GETDATE());
                          UPDATE Comments SET Likes = Likes + 1 WHERE CommentId = @commentId;
        END
                        END TRY
                        BEGIN CATCH
        THROW;
        ROLLBACK;
                        END CATCH;
        COMMIT; `
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error happened on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "Could not find comment." });
                return;
            }
            res.status(201).json({ message: "Successfully added resource." });
        });
    });
});
const unlikeComment = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid." });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired." });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." })
            return;
        }

        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(400).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('commentId', sql.Int, commentId);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         DECLARE @Count INT;

                         SELECT @Count = COUNT(*) 
                         FROM CommentLikes 
                         WHERE UserId = @userId AND CommentId = @commentId;

        IF(@Count = 0)
        BEGIN
                          DELETE FROM CommentLikes WHERE CommentId = @commentId AND UserId = @userId;
                          UPDATE Comments SET Likes = Likes + 1 WHERE CommentId = @commentId;
        END
                        END TRY
                        BEGIN CATCH
        THROW;
        ROLLBACK;
                        END CATCH;
        COMMIT; `
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error happened on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "Could not find comment." });
                return;
            }
            res.status(204).json({ message: "Successfully added resource." });
        });
    });
});
const editComment = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false, role = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        role = decoded.role;
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    sql.connect(config, (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }

        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(401).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        console.log(req.body);
        const content = req.body.content;
        const request = new sql.Request();
        request.input('commentId', sql.Int, commentId);
        request.input('userId', sql.Int, userId);
        request.input('content', sql.VarChar, content);
        request.input('role', sql.VarChar, role);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         DECLARE @Count INT;
    
                         SELECT @Count = COUNT(*)
                         FROM Comments 
                         WHERE CommentId = @commentId AND UserId = @userId;

                         IF(@Count = 1)
                         BEGIN 
                          UPDATE Comments
                          SET Content = @content, UpdatedAt = GETDATE(), Edited = 1
                          WHERE CommentId = @commentId;
                         END
                         ELSE IF(@role = 'admin')
                         BEGIN
                          UPDATE Comments
                          SET Content = @content, AdminUpdatedAt = GETDATE()
                          WHERE CommentId = @commentId;
                         END
                        END TRY
                        BEGIN CATCH
                         THROW;
                         ROLLBACK;
                        END CATCH;
                       COMMIT; `
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            res.status(200).json({ message: "Successfully updated resource.", response: content });
        });
    });
});
const getComment = asyncHandler(async (req, res) => {
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
            handler(error, req, res, "");
            return;
        }

        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(400).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        const existsQuery = `SELECT COUNT(*) FROM Comments WHERE CommentId = ${commentId} `;
        const request = new sql.Request();

        request.query(existsQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
        });
        const getQuery = `SELECT * FROM Comments WHERE CommentId = ${commentId} `;
        request.query(getQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
        });
        res.status(200).json({ message: "Successfully retrieved resource." });
    });
});
const getComments = asyncHandler(async (req, res) => {
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
            handler(error, req, res, "");
            return;
        }

        const commentId = req.params.id;
        if (isNaN(Number(commentId))) {
            res.status(400).json({ message: "Expected integer but instead got string for commentId." });
            return;
        }
        const existsQuery = `SELECT COUNT(*) FROM Comments WHERE CommentId = ${commentId} `;
        const request = new sql.Request();

        request.query(existsQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
        });
        const getQuery = `SELECT * FROM Comments WHERE CommentId = ${commentId} `;
        request.query(getQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
        });
        res.status(200).json({ message: "Successfully retrieved resource." });
    });
});
const getCommentsForRecipe = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let recipeId = req.params.id;
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
            handler(error, req, res, "");
            return;
        }

        if (isNaN(Number(recipeId))) {
            res.status(400).json({ message: "Expected integer but instead got string for recipeId." });
            return;
        }
        const existsQuery = `SELECT COUNT(*) FROM Recipes WHERE RecipeId = ${recipeId} `;
        const request = new sql.Request();

        request.query(existsQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
        });
        const getQuery = `SELECT * FROM Comments WHERE RecipeId = ${recipeId} `;
        request.query(getQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
        });
        res.status(200).json({ message: "Successfully retrieved resource." });
    });
});


module.exports = {
    addComment,
    deleteComment,
    likeComment,
    unlikeComment,
    editComment,
    getComment,
    getComments,
    getCommentsForRecipe
};