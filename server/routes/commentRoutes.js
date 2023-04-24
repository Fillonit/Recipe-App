const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    addComment,
    deleteComment,
    likeComment,
    unlikeComment
} = require('../controllers/commentController.js');

router.route('/:id').post(addComment).delete(deleteComment);
router.route('/like/:id').post(likeComment).delete(unlikeComment);

module.exports = router;