const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    getUsers,
    setUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

router.route('/').get(getUsers).post(setUser);
router.route('/:id').put(updateUser).delete(deleteUser);


module.exports = router;