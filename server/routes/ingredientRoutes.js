const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    getIngredients
} = require('../controllers/ingredientController');

router.route('/').get(getIngredients);


module.exports = router;