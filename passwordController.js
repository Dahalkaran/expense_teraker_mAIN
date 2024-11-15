const SibApiV3Sdk = require('sib-api-v3-sdk');
const User  = require('../models/User'); // Adjust the path to match your project structure

const sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email does not exist' });
    }

    // Set up Sendinblue API client
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = {
      to: [{ email: email }],
      sender: { email: 'dahalkaran27@gmail.com', name: 'Ghanashyam Dahal' },
      subject: 'Password Reset Request',
      htmlContent: `<p>This is a dummy password reset email.</p>`,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = sendForgotPasswordEmail;
