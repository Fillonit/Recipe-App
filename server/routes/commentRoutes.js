const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    addComment,
    deleteComment,
    likeComment,
    unlikeComment,
    editComment,
    getComment
} = require('../controllers/commentController.js');
router.route('/').post(addComment);
router.route('/:id').delete(deleteComment);
router.route('/like/:id').post(likeComment).delete(unlikeComment);
router.route('/edit/:id').post(editComment);
router.route('/get/:id').get(getComment);

module.exports = router;