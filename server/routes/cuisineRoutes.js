const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    getCuisines
} = require('../controllers/cuisineController');

router.route('/').get(getCuisines);


module.exports = router;