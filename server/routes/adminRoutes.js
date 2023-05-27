const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const { 
    usersIncrease,
    recipeIncrease,
    trafficIncrease,
    deleteUser
} = require('../controllers/adminController.js');

router.route('/stats/user').get(usersIncrease);
router.route('/stats/recipe').get(recipeIncrease);
router.route('/stats/traffic').get(trafficIncrease);
router.route('/admin/user/:id').delete(deleteUser);

module.exports = router;