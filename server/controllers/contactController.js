const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
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
    database: 'Recipes',
    server: 'DESKTOP-8HBAVK7',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

const createContact = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];

    let isValid = false, userId, username;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        if (decoded.role != 'user' && decoded.role != 'chef') {
            res.status(403).json({ message: "Couldn't send the contact because you are an admin." });
            return;
        }
        username = decoded.username;
        userId = decoded.userId;
        isValid = true;
    })
    if (!isValid) return;
    const email = req.body.email, name = req.body.name, description = req.body.description;

    sql.connect(config, (error) => {
        if (error) {
            errorHandler(error, req, res, "");
            return;
        }
        const request = new sql.Request();

        request.input('userId', sql.Int, userId);
        request.input('email', sql.VarChar, email);
        request.input('name', sql.VarChar, name);
        request.input('message', sql.VarChar, description);
        request.input('username', sql.VarChar, username);

        const QUERY = `BEGIN TRANSACTION
                         BEGIN TRY
                          DECLARE @ContactCount INT;
                          
                          SELECT @ContactCount = COUNT(*)
                          FROM Contacts
                          WHERE UserId = @userId AND ReceivedAt > DATEADD(DAY, -1, GETDATE()); 
                          IF(@ContactCount = 0)
                          BEGIN
                            INSERT INTO Contacts(UserId, Name, Email, Message, ReceivedAt) VALUES(@userId, @name, @email, @message, GETDATE());
                          
                            INSERT INTO Notifications(UserId, Content, ReceivedAt) 
                            SELECT AdminId, @username+' just sent a contact!', GETDATE()
                            FROM Admin;
                          END
                         END TRY
                         BEGIN CATCH
                          THROW;
                          ROLLBACK;
                         END CATCH;
                       COMMIT;`;
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(500).json({ message: "Couldn't add the resource." });
            }
            res.status(201).json({ message: "Resource added successfully." });
        });
    })
});
const getContacts = asyncHandler(async (req, res) => {
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
            res.status(403).json({ message: "You do not have permission to access this resource." });
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
        const request = new sql.Request();

        const QUERY = `SELECT * FROM Contacts`;
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(500).json({ message: "Couldn't add the resource." });
            }
            res.status(200).json({ message: "Resource fetched successfully.", response: result.recordset });
        });
    })
});
module.exports = {
    createContact,
    getContacts
}