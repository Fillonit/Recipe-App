const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const {
    createContact,
    getContacts,
    acceptContact,
    rejectContact
} = require('../controllers/contactController.js');

router.route('/').post(createContact).get(getContacts);
router.route('/acknowledge').post(acceptContact).delete(rejectContact);

module.exports = router;