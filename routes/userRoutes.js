const express = require('express');
const userController = require('../controllers/userController');
const { getLeaderboard } = require('../controllers/leaderbord');
const router = express.Router();

// Serve the signup HTML file on GET request
router.get('/signup', (req, res) => {
  res.sendFile('signup.html', { root: './views' });
});

// Handle the POST request for signup
router.post('/signup', userController.signup);

router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './views' });
});

router.post('/login', userController.login);

router.get('/leaderboard', getLeaderboard);

module.exports = router;