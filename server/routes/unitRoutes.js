const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    getUnits
} = require('../controllers/unitController');

router.route('/').get(getUnits);


module.exports = router;