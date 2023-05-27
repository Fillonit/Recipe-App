const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    createContact,
    getContacts
} = require('../controllers/contactController.js');

router.route('/').post(createContact).get(getContacts);

module.exports = router;