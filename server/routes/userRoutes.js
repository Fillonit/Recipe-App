const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
const {
    getUsers,
    getUser,
    register,
    editUser,
    deleteUserr,
    logUserIn,
    updateUser,
} = require('../controllers/userController');

router.route('/').get(getUser).post(upload.single('image'), register);
router.route('/all').get(getUsers);
router.route('/login').post(logUserIn);
router.route('/:id').get(getUser).put(editUser).delete(deleteUserr).patch(updateUser);
// router.route('/all').get(getUsers);
module.exports = router;