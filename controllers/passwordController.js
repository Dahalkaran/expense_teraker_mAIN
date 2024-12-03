const SibApiV3Sdk = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const ForgotPasswordRequest = require('../models/ForgotPasswordRequest');
const sequelize = require('../config/database'); // Import the sequelize instance

const sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email does not exist' });
    }

    const requestId = uuidv4();
    const forgotPasswordRequest = await ForgotPasswordRequest.create({
      id: requestId,
      UserId: user.id,
      isActive: true,
    });

    const resetUrl = `http://localhost:3000/resetpassword/${requestId}`;
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    //console.log(process.env.SENDINBLUE_API_KEY);
    apiKey.apiKey =process.env.SENDINBLUE_API_KEY;
    
    
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = {
      to: [{ email }],
      sender: { email: 'dahalkaran27@gmail.com', name: 'Ghanashyam Dahal' },
      subject: 'Password Reset Request',
      htmlContent: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

const getResetPasswordForm = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await ForgotPasswordRequest.findOne({ where: { id, isActive: true } });

    if (!request) {
      return res.status(404).json({ error: 'Invalid or expired reset password link' });
    }

    res.status(200).send(`
      <form method="POST" action="/resetpassword/${id}">
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" name="newPassword" required />
        <button type="submit">Reset Password</button>
      </form>
    `);
  } catch (error) {
    console.error('Error handling reset request:', error);
    res.status(500).json({ error: 'Failed to handle reset request' });
  }
};

const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  const transaction = await sequelize.transaction(); // Use the sequelize instance

  try {
    const request = await ForgotPasswordRequest.findOne(
      { where: { id, isActive: true } },
      { transaction }
    );

    if (!request) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Invalid or expired reset password link' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedPassword },
      { where: { id: request.UserId }, transaction }
    );

    await ForgotPasswordRequest.update(
      { isActive: false },
      { where: { id }, transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

module.exports = {
  sendForgotPasswordEmail,
  getResetPasswordForm,
  resetPassword,
};
