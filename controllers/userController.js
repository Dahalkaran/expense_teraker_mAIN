const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order=require('../models/order')
const sequelize = require('../config/database');
// JWT secret (store in environment variables for production)
const JWT_SECRET ='ykjdsivjnsnvhjcsbnvhjscbivnsxkjvnxkjcvnskjxjnvkjxncvkjnkjvncxnv'
//process.env.JWT_SECRET;
//
//process.env.JWT_SECRET;
//console.log("kmmkmbkm ksmkmomomoiomom oio oim  ",JWT_SECRET);
// Signup controller to create a new user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const t = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({ where: { email }, transaction: t });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword }, { transaction: t });
    await t.commit();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Error creating user' });
  }
};

// Login controller to authenticate the user and return a JWT
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
    
    const successfulOrder = await Order.findOne({ 
      where: { 
        UserId: user.id, 
        status: 'SUCCESS' 
      } 
    });


    const buyPremium = successfulOrder ? true : false;

    // Generate JWT token for the authenticated user
    const token = jwt.sign({ id: user.id, email: user.email,buyPremium }, JWT_SECRET);
   // console.log(token);
    res.status(200).json({ message: 'Login success', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};