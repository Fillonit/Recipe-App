const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    getTags
} = require('../controllers/tagController');

router.route('/').get(getTags);


module.exports = router;