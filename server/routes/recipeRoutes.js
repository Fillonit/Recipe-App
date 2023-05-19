const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const multer = require('multer');
const uploads = multer({ dest: "../uploads/" });
const port = process.env.PORT || 5000;

const {
    deleteRecipe,
    addRecipe,
    getRecipes,
    getRecipe,
    editRecipe
} = require('../controllers/recipeController');

router.route('/add/:id').post(addRecipe);
router.route('/delete/:id').delete(deleteRecipe, uploads.single('file'));


module.exports = router;