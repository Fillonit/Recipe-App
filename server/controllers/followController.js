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
const TOKEN_KEY = process.env.TOKEN_KEY;


const followChef = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, role = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (decoded.role == "admin") {
            res.status(403).json({ message: "Admins cannot follow others." });
            return;
        }
        userId = decoded.userId;
        role = decoded.role;
        isValid = true;
    });
    if (!isValid) return;
    sql.connect(config, async (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }

        const followerId = userId, followeeId = req.params.id;
        if (followerId == followeeId) {
            res.status(409).json({ message: "You cannot follow yourself." });
            return;
        }
        const request = new sql.Request();
        request.input('follower', sql.Int, followerId);
        request.input('followee', sql.Int, followeeId);
        const QUERY = `BEGIN TRANSACTION;
                        BEGIN TRY
                           INSERT INTO Followers(FollowerId, FolloweeId) VALUES (@follower, @followee);
                           
                           DECLARE @FollowerUsername VARCHAR(50);
                           DECLARE @FolloweeUsername VARCHAR(50);

                           SELECT @FollowerUsername = Username
                           FROM Users
                           WHERE UserId = @follower;

                           INSERT INTO Notifications(UserId, Content, ReceivedAt) VALUES (@followee,CONCAT(@FollowerUsername, ' just followed you!'), GETDATE());

                           UPDATE Chef
                           SET FollowersCount = FollowersCount + 1
                           WHERE ChefId = @followee;
                           
                           UPDATE Following
                           SET FollowingCount = FollowingCount + 1
                           WHERE UserId = @follower;
                           DECLARE @NotificationCount INT;

                           SELECT @NotificationCount = COUNT(*)
                           FROM Notifications
                           WHERE UserId = @followee;
                           
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
                             WHERE NotificationId = @EarliestNotification;
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
            if (result.rowsAffected <= 0) {
                res.status(400).json({ message: "Could not follow chef." });
                return;
            }
            res.status(201).json({ message: "Successfully created resource." });
        });
    });
});
const unfollowChef = asyncHandler(async (req, res) => {
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
        if (decoded.role == "admin") {
            res.status(403).json({ message: "Admins cannot follow others." });
            return;
        }
        userId = decoded.userId;
        role = decoded.role;
    });
    sql.connect(config, (error) => {
        if (error) {
            res.status(500).json({ message: "An error occurred on our part." });
            return;
        }

        const followerId = userId, followeeId = req.params.id;
        if (followerId == followeeId) {
            res.status(409).json({ message: "You cannot follow yourself." });
            return;
        }

        const request = new sql.Request();
        request.input('follower', sql.Int, followerId);
        request.input('followee', sql.Int, followeeId);
        const QUERY = `BEGIN TRANSACTION;
                          BEGIN TRY
                            DECLARE @FollowingCount INT;
         
                            SELECT @FollowingCount = COUNT(*)
                            FROM Followers
                            WHERE FollowerId = @follower AND FolloweeId = @followee;
         
                            IF(@FollowingCount = 1)
                             BEGIN
                              DELETE FROM Followers
                              WHERE FollowerId = @follower AND FolloweeId = @followee;

                              UPDATE Chef
                              SET FollowersCount = FollowersCount - 1
                              WHERE ChefId = @followee;

                              DELETE FROM ChefFavorites
                              WHERE ChefId = @followee AND UserId = @follower;
                              
                              UPDATE Following
                              SET FollowingCount = FollowingCount - 1
                              WHERE UserId = @follower;
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
            if (result.rowsAffected <= 0) {
                res.status(400).json({ message: "Could not unfollow chef." });
                return;
            }
            res.status(204).json({ message: "Successfully deleted resource." });
        });
    });
});

const getFollowers = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let chefId = null;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        chefId = decoded.userId;
    });
    sql.connect(config, (error) => {
        if (error) {
            handler(error, req, res, ""); // im not sure what next is
            return;
        }

        const request = new sql.Request();
        request.input('chefId', sql.Int, chefId);

        const QUERY = `SELECT Users.UserId, Users.Username, Users.FirstName, Users.LastName, Users.ProfilePicture
                          FROM Users
                            INNER JOIN Followers
                                ON Followers.FollowerId = Users.UserId
                            WHERE Followers.FolloweeId = @chefId;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            res.status(200).json(result.recordset);
        });
    });
});
module.exports = {
    followChef,
    unfollowChef,
    getFollowers
};