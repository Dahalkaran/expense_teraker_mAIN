const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const FileURL = require('./fileUrl');
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }, totalSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,  
  },

});
User.hasMany(FileURL, { foreignKey: 'UserId', onDelete: 'CASCADE' });
FileURL.belongsTo(User, { foreignKey: 'UserId' });

module.exports = User;