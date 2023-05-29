const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const path = require("path");
const multer = require('multer');
const TOKEN_KEY = process.env.TOKEN_KEY;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/chefApplications');
    },
    filename: (req, file, cb) => {
        const token = req.headers['r-a-token'];

        jwt.verify(token, TOKEN_KEY, (err, decoded) => {
            if (err) {
                cb({ message: "Token is invalid" }, null);
                return;
            }
            if (Date.now() / 1000 > decoded.exp) {
                cb({ message: "Token is expired" }, null);
                return;
            }
            if (decoded.role != 'user') {
                cb({ message: "You are not authorized to add this resource" }, null);
                return;
            }
            cb(null, decoded.userId + "," + Date.now() + path.extname(file.originalname));
        });
    }
});
const upload = multer({ storage: storage });

const {
    getAplication,
    addAplication
} = require('../controllers/chefApplicationController');

router.route('/').get(getAplication).post(upload.single('image'), addAplication);

module.exports = router;