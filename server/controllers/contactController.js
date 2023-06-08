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
const getContacts = asyncHandler(async (req, res, next) => {
    const token = req.headers['r-a-token'];
    let isValid = false;
    const page = req.headers['page'], rows = req.headers['rows'];
    console.log(req.headers);
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
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
        request.input('offset', sql.Int, (page - 1) * rows);
        request.input('rows', sql.Int, rows);
        console.log(request.parameters)
        const QUERY = `SELECT u.Username, c.Description, c.CreatedAt, u.UserId, c.ContactId
                       FROM Contacts c
                         JOIN Users u
                         ON c.UserId = u.UserId
                       ORDER BY c.CreatedAt DESC
                       OFFSET @offset ROWS
                       FETCH NEXT @rows ROWS ONLY;`;

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
                          WHERE UserId = @userId AND CreatedAt > DATEADD(DAY, -1, GETDATE()); 
                          IF(@ContactCount = 0)
                          BEGIN
                            INSERT INTO Contacts(UserId, Description, CreatedAt) VALUES(@userId, @message, GETDATE());
                          
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
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(500).json({ message: "Couldn't add the resource." });
            }
            res.status(201).json({ message: "Resource added successfully." });
        });
    })
});
const acceptContact = asyncHandler(async (req, res) => {

    const token = req.headers['r-a-token'];

    let isValid = false;
    const adminResponse = req.body.response;
    const contacter = req.body.contacter;
    const contactId = req.body.contactId;

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
            res.status(403).json({ message: "User types other than admins cannot accept contacts." });
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
        request.input('description', sql.VarChar, adminResponse);
        request.input('contacter', sql.Int, contacter);
        request.input('contactId', sql.Int, contactId);
        const QUERY = `BEGIN TRANSACTION
                         BEGIN TRY
                          DECLARE @ContactCount INT;
                          
                          SELECT @ContactCount = COUNT(*)
                          FROM Contacts
                          WHERE ContactId = @contactId; 
                          IF(@ContactCount = 1)
                          BEGIN
                            DELETE FROM Contacts
                            WHERE ContactId = @contactId
                          
                            INSERT INTO Notifications(UserId, Content, ReceivedAt) 
                            VALUES(@contacter, CONCAT('An admin just responded to your contact: ',@description), GETDATE());
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
                res.status(400).json({ message: "Couldn't add the resource." });
            }
            res.status(201).json({ message: "Resource added successfully." });
        });
    })
});
const rejectContact = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];

    let isValid = false;
    const contactId = req.body.contactId;
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
            res.status(403).json({ message: "User types other than admins cannot accept contacts." });
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
        request.input('contactId', sql.Int, contactId);
        const QUERY = `DELETE FROM Contacts
                       WHERE ContactId = @contactId`;
        request.query(QUERY, (err, result) => {
            if (err) {
                errorHandler(error, req, res, "");
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(500).json({ message: "Couldn't add the resource." });
            }
            res.status(204).json({ message: "Resource added successfully." });
        });
    })
});
module.exports = {
    createContact,
    getContacts,
    acceptContact,
    rejectContact
}