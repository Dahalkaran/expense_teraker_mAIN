const sequelize = require('sequelize');
const Expense = require('../models/expense');
const User = require('../models/User');

// Leaderboard controller
exports.getLeaderboard = async (req, res) => {
    try {
      const leaderboard = await User.findAll({
        include: [{
          model: Expense,
          attributes: [], // Do not select individual columns from the Expenses model
        }],
        attributes: [
          'id',
          'name',
          'email',
          [sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'totalSpent']
        ], // Select only the aggregated totalSpent
        group: ['User.id', 'User.name', 'User.email'], // Group only by User columns
        order: [[sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'DESC']], // Order by total expenses descending
      });
      // Return the leaderboard data
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
  };