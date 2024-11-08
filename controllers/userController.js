const User = require('../models/User');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // Send a specific error response if the email is taken
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Create a new user if email is not taken
    await User.create({ name, email, password });
    res.status(201).json({ message: 'User created successfully' });
  }  catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Error creating user' });
  }
};