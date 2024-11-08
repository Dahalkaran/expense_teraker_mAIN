const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Slot = sequelize.define('Slot', {
  time_slot: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  available: {
    type: DataTypes.INTEGER,
    defaultValue: 4,  // Starting with 3 slots available for each time period
  },
});

module.exports = Slot;
