const sequelize = require('sequelize');
const Expense = require('../models/expense');
const User = require('../models/User');

// Leaderboard controller
exports.getLeaderboard = async (req, res) => {
    try {
      // const leaderboard = await User.findAll({
      //   include: [{
      //     model: Expense,
      //     attributes: [],
      //   }],
      //   attributes: [
      //     'id',
      //     'name',
      //     'email',
      //     [sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'totalSpent']
      //   ], // Select only the aggregated totalSpent
      //   group: ['User.id', 'User.name', 'User.email'], // Group only by User columns
      //   order: [[sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'DESC']], 
      // });
      // console.log(leaderboard)
      // // Return the leaderboard data
      // res.status(200).json(leaderboard);


      

      const users = await User.findAll({
        attributes: ['id', 'name', 'email']
      });
  

      const expenses = await Expense.findAll({
        attributes: [
          'userId',
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
        ],
        group: ['userId']
      });
      const userLeaderBoardDetails = [];
       
      users.forEach((user) => {
        const userExpense = expenses.find(exp => exp.userId === user.id);
        userLeaderBoardDetails.push({
          id: user.id,
          name: user.name,
          email: user.email,
          totalSpent: userExpense ? userExpense.get('totalSpent') : 0
        });
      });
  
      // Sort the leaderboard by totalSpent in descending order
      userLeaderBoardDetails.sort((a, b) => b.totalSpent - a.totalSpent);
  
      // Return the sorted leaderboard data
      res.status(200).json(userLeaderBoardDetails);


      console.log(userLeaderBoardDetails)
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
  };