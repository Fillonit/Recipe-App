const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const jwt = require('jsonwebtoken');


const config = {
    database: 'Recipes',
    server: 'DESKTOP-8HBAVK7',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};
const TOKEN_KEY = process.env.TOKEN_KEY;


const getNotifications = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    const rows = req.headers['rows'], page = req.headers['page'];
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, async (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }

        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('offset', sql.Int, (page - 1) * rows);
        request.input('rows', sql.Int, rows);
        const QUERY = `SELECT Content, Seen,
                        CASE
                          WHEN diff < 60 THEN CAST(diff AS VARCHAR(10))+ 's'
                          WHEN diff < 3600 THEN CAST(CAST(diff/60 AS INT) AS VARCHAR(10))+ 'm'
                          WHEN diff < 86400 THEN CAST(CAST(diff/3600 AS INT) AS VARCHAR(10))+ 'h'
                          WHEN diff < 604800 THEN CAST(CAST(diff/86400 AS INT) AS VARCHAR(10))+ 'd'
                          ELSE CAST(CAST(diff/604800 AS INT) AS VARCHAR(10))+'w'
                        END AS TimeDifference
                        FROM (SELECT Content, Seen, DATEDIFF_BIG(SECOND, ReceivedAt, GETDATE()) AS diff
                              FROM Notifications
                              WHERE UserId = @userId
                              ORDER BY ReceivedAt DESC
                              OFFSET @offset ROWS
                              FETCH NEXT @rows ROWS ONLY) AS subquery`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            res.status(200).json({ message: "Successfully fetched resource.", response: result.recordset });
        });
    });
});
const getNotificationCount = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    console.log(token);
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            console.log(err);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, async (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }

        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        const QUERY = `SELECT COUNT(*) AS NotificationCount
                       FROM Notifications
                       WHERE UserId = @userId AND Seen = 0`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            res.status(200).json({ message: "Successfully fetched resource.", response: result.recordset });
        });
    });
});

const markNotificationAsSeen = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, async (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }
        const notificationId = req.params.id;
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('notificationId', sql.Int, notificationId);
        const QUERY = `   UPDATE Notifications
                          SET Seen = 1
                          WHERE NotificationId = @notificationId AND UserId = @userId`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected <= 0) {
                res.status(400).json({ message: "Could not mark notification as seen." });
                return;
            }
            res.status(200).json({ message: "Successfully updated resource." });
        });
    });
});
const deleteNotification = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, async (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }
        const notificationId = req.params.id;
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('notificationId', sql.Int, notificationId);
        const QUERY = `   DELETE FROM Notifications
                          WHERE NotificationId = @notificationId AND UserId = @userId`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected <= 0) {
                res.status(400).json({ message: "Could not delete notification." });
                return;
            }
            res.status(204).json({ message: "Successfully deleted resource." });
        });
    });
});

module.exports = {
    getNotificationCount,
    getNotifications,
    markNotificationAsSeen,
    deleteNotification
}