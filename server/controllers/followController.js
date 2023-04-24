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


const unfollowChef = asyncHandler(async (req, res) => {
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
        if (decoded.role == "admin") {
            res.status(403).json({ message: "Admins cannot unfollow others." });
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

        const followerId = userId, followeeId = req.params.id;

        const chefQuery = `SELECT COUNT(*) AS count FROM Chef WHERE ChefId = ${followeeId}`;
        const request = new sql.Request();

        request.query(chefQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(403).json({ message: "Could not find the chef provided." });
                return;
            }
        });

        const followingQuery = `SELECT COUNT(*) AS count FROM Followers WHERE FolloweeId = ${followeeId} AND FollowerId = ${followerId}`;
        request.query(followingQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(409).json({ message: "Conflict, user cannot unfollow someone they are not following." });
                return;
            }
        });
        const tableToUpdate = {
            user: ["Normal_User", "NormalUserId"],
            chef: ["Chef", "ChefId"]
        }/*^ Explanation about this:
            When user X follows someone else, then it means that user X FollowingCount must be incremented
            by 1, because they now follow one more chef, and the table in which I have to increment the follower count, depends on what role the 
            one who wants to follow has, for example:
              1. if the user who wants to follow the chef
                     is a normal user, then I want to increment 
                     the FollowingCount in the Normal_User table
              2. If the user who wants to follow the chef
                     is a chef, then I want to increment 
                     the FollowingCount in the Chef table
        */
        const queries = [];
        queries.push(`DELETE FROM Followers WHERE FolloweeId = ${followeeId} AND FollowerId = ${FollowerId}`);
        queries.push(`UPDATE Chef SET FollowersCount = FollowersCount - 1 WHERE ChefId = ${followeeId}`);
        queries.push(`UPDATE ${tableToUpdate[role][0]} SET FollowingCount = FollowingCount - 1 WHERE ${tableToUpdate[role][1]} = ${userId}`);
        queries.unshift(`BEGIN TRANSACTION`);
        queries.push(`COMMIT`);
        const QUERY = queries.join("; ");
        request.query(QUERY, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
        });
        res.status(204).json({ message: "Successfully updated resource." });
    });
});
const followChef = asyncHandler(async (req, res) => {
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
        if (decoded.role == "admin") {
            res.status(403).json({ message: "Admins cannot follow others." });
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

        const followerId = userId, followeeId = req.params.id;

        const chefQuery = `SELECT COUNT(*) AS count FROM Chef WHERE ChefId = ${followeeId}`;
        const request = new sql.Request();

        request.query(chefQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(403).json({ message: "Could not find the chef provided." });
                return;
            }
        });

        const followingQuery = `SELECT COUNT(*) AS count FROM Followers WHERE FolloweeId = ${followeeId} AND FollowerId = ${followerId}`;
        request.query(followingQuery, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
            if (result.recordset.length !== 0) {
                res.status(409).json({ message: "Conflict, user is already following the chef in question." });
                return;
            }
        });
        const tableToUpdate = {
            user: ["Normal_User", "NormalUserId"],
            chef: ["Chef", "ChefId"]
        }/*^ Explanation about this:
            When user X follows someone else, then it means that user X FollowingCount must be incremented
            by 1, because they now follow one more chef, and the table in which I have to increment the follower count, depends on what role the 
            one who wants to follow has, for example:
              1. if the user who wants to follow the chef
                     is a normal user, then I want to increment 
                     the FollowingCount in the Normal_User table
              2. If the user who wants to follow the chef
                     is a chef, then I want to increment 
                     the FollowingCount in the Chef table
        */
        const queries = [];
        queries.push(`INSERT INTO Followers(FolloweeId, FollowerId) VALUES (${followeeId}, ${followerId})`);
        queries.push(`UPDATE Chef SET FollowersCount = FollowersCount + 1 WHERE ChefId = ${followeeId}`);
        queries.push(`UPDATE ${tableToUpdate[role][0]} SET FollowingCount = FollowingCount + 1 WHERE ${tableToUpdate[role][1]} = ${userId}`);
        queries.unshift(`BEGIN TRANSACTION`);
        queries.push(`COMMIT`);
        const QUERY = queries.join("; ");
        request.query(QUERY, (err, result) => {
            if (err) {
                handler(error, req, res, "");
                return;
            }
        });
        res.status(204).json({ message: "Successfully updated resource." });
    });
});
module.exports = {
    followChef,
    unfollowChef
};