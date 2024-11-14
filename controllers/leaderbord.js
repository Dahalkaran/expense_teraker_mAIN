const sequelize = require('sequelize');
const Expense = require('../models/expense');
const User = require('../models/User');


exports.getLeaderboard = async (req, res) => {
    try {
      const leaderboard = await User.findAll({
        attributes: ['id','name', 'email', 'totalSpent'], // Fetch only id, email, and totalSpent
        order: [['totalSpent', 'DESC']]  // Order by totalSpent in descending order
      });
     console.log(leaderboard);
      res.status(200).json(leaderboard);
   } catch (error) {
          console.error('Error fetching leaderboard:', error);
          res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
        }
      };