const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    followChef,
    unfollowChef
} = require('../controllers/followController.js');

router.route('/:id').post(followChef);
router.route('/:id').delete(unfollowChef);


module.exports = router;