const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Request is active by default
  },
  UserId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  }
});

User.hasMany(ForgotPasswordRequest, { foreignKey: 'UserId' });
ForgotPasswordRequest.belongsTo(User, { foreignKey: 'UserId' });
module.exports = ForgotPasswordRequest;