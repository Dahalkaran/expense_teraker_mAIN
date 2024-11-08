const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const meetingRoutes = require('./routes/meetingRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static('public'));  // Serve static files

app.use(express.static('public'));

app.use('/', meetingRoutes);

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => console.log('Error syncing database: ', err));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});