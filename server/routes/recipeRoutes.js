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
    getRecipe,
    getRecipes,
    getFavorites,
    filterRecipes,
    updateRecipe,
    getRecipesByChef,
    getPopularRecipes,
    getRecentRecipes,
    getMostLikedRecipes,
    likeRecipe,
    unlikeRecipe
} = require('../controllers/recipeController');

router.route('/get').get(getRecipes);
router.route('/get/:id').get(getRecipe);
router.route('/add').post(upload.single('image'), addRecipe);
router.route('/delete/:id').delete(deleteRecipe);
router.route('/edit/:id').post(updateRecipe);
router.route('/get/favorites').get(getFavorites);
router.route('/getByChef/:id').get(getRecipesByChef);
router.route('/filter').get(filterRecipes);
router.route('/get/popular').get(getPopularRecipes);
router.route('/get/recent').get(getRecentRecipes);
router.route('/get/mostLiked').get(getMostLikedRecipes);
router.route('/like/:id').post(likeRecipe).delete(unlikeRecipe);
// router.route('/like/:id').post(likeRecipe);
// router.route('/like/:id').delete(unlikeRecipe);


module.exports = router;