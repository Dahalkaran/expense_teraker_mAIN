const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FileURL = sequelize.define('FileURL', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = FileURL;
