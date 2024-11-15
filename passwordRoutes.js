const express = require('express');
const router = express.Router();
const sendForgotPasswordEmail = require('../controllers/passwordController');

router.post('/forgotpassword', sendForgotPasswordEmail);

module.exports = router;
