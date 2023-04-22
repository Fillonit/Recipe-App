const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const multer = require('multer');
const uploads = multer({ dest: "../uploads/" });
const port = process.env.PORT || 5000;

const {
    deleteRecipe,
    addRecipe
} = require('../controllers/recipeController');

router.route('/add/:id').post(addRecipe);
router.route('/delete/:id').post(deleteRecipe, uploads.single('file'));


module.exports = router;