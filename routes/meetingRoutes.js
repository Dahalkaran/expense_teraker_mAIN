const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/MeetingController');
const path = require('path');
//Serve the static HTML page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// API routes to fetch slots and meetings
router.get('/slots', meetingController.getSlots);
router.get('/meetings', meetingController.getMeetings);

// Routes for booking and canceling meetings
router.post('/book', meetingController.bookMeeting);
router.post('/cancel/:id', meetingController.cancelMeeting);

module.exports = router;
