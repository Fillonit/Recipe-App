const asyncHandler = require('express-async-handler');

// @desc: Get all users from the database
// @route: GET /api/users
// @access: Private
const getUsers = asyncHandler(async (req, res) => {
    res.status(200).json({
        msg: 'Get user!'
    });
});

// @desc: Get user from the database
// @route: GET /api/users/:id
// @access: Private
const getUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        msg: `Get user with id: ${req.params.id}`
    });
});

// @desc: Set user from the database
// @route: POST /api/users
// @access: Private
const setUser = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('No text');
    }


    res.status(200).json({
        msg: 'Set user!'
    });
});

// @desc: Update all users from the database
// @route: PUT /api/users
// @access: Private
const updateUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        msg: `Update user with id: ${req.params.id}`
    });
});

// @desc: Delete user from the database
// @route: DELETE /api/users
// @access: Private
const deleteUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        msg: `Delete user with id: ${req.params.id}`
    });
});

module.exports = {
    getUsers,
    setUser,
    updateUser,
    deleteUser
};