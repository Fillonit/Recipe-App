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
    getFavorites,
    filterRecipes,
    updateRecipe,
    getRecipesByChef,
    // likeRecipe,
    // unlikeRecipe
    // editRecipe
} = require('../controllers/recipeController');

router.route('/get').get(getRecipes);
router.route('/get/:id').get(getRecipe);
router.route('/add').post(upload.single('image'), addRecipe);
router.route('/delete/:id').delete(deleteRecipe);
router.route('/edit/:id').post(updateRecipe);
router.route('/get/favorites').get(getFavorites);
router.route('/getByChef/:id').get(getRecipesByChef);
router.route('/filter').get(filterRecipes);
// router.route('/like/:id').post(likeRecipe);
// router.route('/like/:id').delete(unlikeRecipe);


module.exports = router;