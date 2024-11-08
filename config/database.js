const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('meeting', 'root', 'Dahal@123', {dialect: 'mysql', host: 'localhost'});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
