const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    initRecipes
} = require('../controllers/initRecipesController');

router.route('/').get(initRecipes);


module.exports = router;