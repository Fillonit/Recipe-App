const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const { getNotifications, getNotificationCount, deleteNotification, markNotificationAsSeen } = require('../controllers/notificationController.js');

router.route('/').get(getNotifications);
router.route('/:id').delete(deleteNotification).put(markNotificationAsSeen);
router.route('/count').get(getNotificationCount);

module.exports = router;