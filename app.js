const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // Built-in middleware to parse JSON
app.use(express.static('public'));
app.use(express.static('views'));

// Routes
app.use(userRoutes);
app.use(expenseRoutes);

// Sync the database and start the server
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch(err => console.log(err));