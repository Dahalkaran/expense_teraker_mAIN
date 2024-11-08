const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // Send a specific error response if the email is taken
      return res.status(400).json({ error: 'Email is already registered' });
    }
      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user if email is not taken
    await User.create({ name, email, password:hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
  }  catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Error creating user' });
  }
 
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not exists' });
    }

   
      // Compare the entered password with the hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login success' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};