const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');  

const Expense = sequelize.define('Expense', {
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  }
});
// Define the relationship between User and Expense
User.hasMany(Expense, { foreignKey: 'UserId' });
Expense.belongsTo(User, { foreignKey: 'UserId' });

module.exports = Expense;