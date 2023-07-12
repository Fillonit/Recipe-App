const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { errorHandler } = require("../middleware/errorMiddleware.js");
const { off } = require('process');
const { Console } = require('console');
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

const addApplication = asyncHandler(async (req, res) => {
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
        if (decoded.role != 'user') {
            res.status(403).json({ message: "You do not have permission to add this resource." });
            return;
        }
        isValid = true;
        userId = decoded.userId
    })
    if (!isValid) return;
    if (req.file === undefined) {
        res.status(401).json({ message: "You must provide an image for applying for a chef." });
        return;
    }
    sql.connect(config, (error) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }
        const request = new sql.Request();
        const { experience, worksAt, description } = req.body;
        request.input('userId', sql.Int, userId);
        request.input('experience', sql.Int, experience);
        request.input('worksAt', sql.VarChar, worksAt);
        request.input('description', sql.VarChar, description);
        request.input('imageUrl', sql.VarChar, `http://localhost:5000/images/chefApplications/${req.file.filename}`);
        console.log(req.body);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         DECLARE @Count INT;

                         SELECT @Count = COUNT(*)
                         FROM ChefApplications 
                         WHERE UserId = @userId;
                         
                         IF(@Count = 0)
                          BEGIN 
                           INSERT INTO ChefApplications(UserId, Experience, WorksAt, Description, ImageUrl)
                           VALUES (@userId, @experience, @worksAt, @description, @imageUrl);
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
            res.status(201).json({ message: "Resource created successfully." });
        });
    })
});
const getApplication = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    const page = req.headers['page'];
    const rows = req.headers['pagesize'];
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
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You do not have permission to get this resource." });
            return;
        }
        isValid = true;
        userId = decoded.userId
    })
    if (!isValid) return;
    sql.connect(config, (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }
        const request = new sql.Request();
        console.log(req.headers);
        request.input('offset', sql.Int, (page - 1) * rows);
        request.input('rows', sql.Int, rows);
        const QUERY = `SELECT ca.*, u.Username
                       FROM ChefApplications ca
                         JOIN Users u 
                         ON u.UserId = ca.UserId
                       ORDER BY ca.UserId
                       OFFSET @offset ROWS
                       FETCH NEXT @rows ROWS ONLY`;
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error occurred on our part." });
                return;
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordset });
        });
    })
});
const rejectPromotionToChef = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
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
    const userToReject = req.params.id;
    sql.connect(config, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error ocurred in our part." });
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userToReject);
        const QUERY = `BEGIN TRANSACTION;
                        BEGIN TRY
                         DECLARE @Count INT;
                         
                         SELECT @Count = COUNT(*)
                         FROM ChefApplications 
                         WHERE UserId = @userId

                         IF(@Count = 1)
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
                        END TRY
                        BEGIN CATCH
                         THROW;
                         ROLLBACK;
                        END CATCH;
                      COMMIT;`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error ocurred in our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected <= 0) {
                console.log(result.rowsAffected);
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
    console.log(req.body);
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
            console.log(err);
            res.status(500).json({ message: "An error ocurred in our part." });
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userToPromote);
        request.input('experience', sql.Float, experience);
        request.input('worksAt', sql.VarChar, worksAt);
        console.log(userToPromote);
        const QUERY = `BEGIN TRANSACTION;
                        BEGIN TRY
                         DECLARE @Count INT;
                         
                         SELECT @Count = COUNT(*)
                         FROM ChefApplications
                         WHERE UserId = @userId;
                        
                         IF(@Count = 1)
                          BEGIN
                           INSERT INTO Chef(ChefId, Experience, WorksAt) VALUES (@userId, @experience, @worksAt);

                           DELETE FROM ChefApplications
                           WHERE UserId = @userId;

                           DELETE FROM Normal_User
                           WHERE UserId = @userId;

                           UPDATE Users
                           SET Role = 'chef'
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
                        END TRY
                        BEGIN CATCH
                         THROW;
                         ROLLBACK;
                        END CATCH;
                       COMMIT;`;
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error ocurred in our part." });
                return;
            }
            if (result.rowsAffected <= 0) {
                console.log(result.rowsAffected);
                res.status(401).json({ message: "The data provided conflicts with our database" });
                return;
            }
            res.status(201).json({ message: "Created resource successfully." });
        })
    });
});
module.exports = {
    getApplication,
    addApplication,
    promoteToChef,
    rejectPromotionToChef
}