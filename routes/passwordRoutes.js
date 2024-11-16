const express = require('express');
const router = express.Router();
const {
    sendForgotPasswordEmail,
    getResetPasswordForm,
    resetPassword,
  } = require('../controllers/passwordController');
  

  router.post('/forgotpassword', sendForgotPasswordEmail);
  router.get('/resetpassword/:id', getResetPasswordForm);
  router.post('/resetpassword/:id', resetPassword);
  
  module.exports = router;
