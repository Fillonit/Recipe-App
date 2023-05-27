const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    getUsers,
    getUser,
    register,
    editUser,
    deleteUserr,
    logUserIn,
    updateUser
} = require('../controllers/userController');

router.route('/').get(getUsers).post(register);
router.route('/:id').get(getUser).put(editUser).delete(deleteUserr).patch(updateUser);
router.route('/login').post(logUserIn);
module.exports = router;