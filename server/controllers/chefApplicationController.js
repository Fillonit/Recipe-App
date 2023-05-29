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

const addAplication = asyncHandler(async (req, res) => {
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
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }
        const request = new sql.Request();
        const { userId, experience, worksAt, description } = req.body;
        request.input('userId', sql.Int, userId);
        request.input('experience', sql.Int, experience);
        request.input('worksAt', sql.VarChar, worksAt);
        request.input('description', sql.VarChar, description);
        request.input('imageUrl', sql.VarChar, `http://localhost:5000/image/${req.file.filename}`);

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
                return;
            }
            res.status(201).json({ message: "Resource created successfully." });
        });
    })
});
const getAplication = asyncHandler(async (req, res) => {
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

        request.input('userId', sql.Int, userId);

        const QUERY = `SELECT * FROM ChefApplications WHERE UserId = @userId`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                return;
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordset });
        });
    })
});
module.exports = {
    getAplication,
    addAplication
}