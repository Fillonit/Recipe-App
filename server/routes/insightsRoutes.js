const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    followers,
    likes,
    views,
    comments,
    likeUserRatio
} = require('../controllers/insightsController');

router.route('/followers').get(followers);
router.route('/likes').get(likes);
router.route('/views').get(views);
router.route('/comments').get(comments);
router.route('/likeUserRatio').get(likeUserRatio);


module.exports = router;