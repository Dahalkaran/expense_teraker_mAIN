const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchase=require('./routes/purchaseRoutes');
const password=require('./routes/passwordRoutes')

const cors = require('cors');
require('dotenv').config();

const app = express();
require('dotenv').config();
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); 
app.use(express.static('public'));
app.use(express.static('views'));

app.use(cors())

// Routes
app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchase);
app.use(password);
// Sync the database and start the server
//{ force: true }

sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch(err => console.log(err));