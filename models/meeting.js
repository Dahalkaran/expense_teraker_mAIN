const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Slot = require('./Slot');

const Meeting = sequelize.define('Meeting', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slot_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Slot,
      key: 'id',
    },
  },
});

Meeting.belongsTo(Slot, { foreignKey: 'slot_id' });

module.exports = Meeting;
