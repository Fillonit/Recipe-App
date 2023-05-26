const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const {
    deleteRecipe,
    addRecipe,
    getRecipes,
    getRecipe,
    // editRecipe
} = require('../controllers/recipeController');

router.route('/add').post(upload.single('image'), addRecipe);
router.route('/delete/:id').delete(deleteRecipe);
// router.route('/edit/:id').post(editRecipe);
router.route('/get/:id').get(getRecipe);
router.route('/get').get(getRecipes);


module.exports = router;