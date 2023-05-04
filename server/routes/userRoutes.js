const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    getUsers,
    getUser,
    register,
    editUser,
    deleteUser,
    logUserIn,
    testError
} = require('../controllers/userController');

router.route('/').get(getUsers).post(register);
router.route('/:id').get(getUser).put(editUser).delete(deleteUser);
router.route('/login').post(logUserIn);
router.route('/test').get(testError);
module.exports = router;