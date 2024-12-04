const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchase=require('./routes/purchaseRoutes');
const password=require('./routes/passwordRoutes')
const helmet=require('helmet')
const morgan=require('morgan');
const fs=require('fs');
const path=require('path')
const cors = require('cors');
const https=require('https')
require('dotenv').config();

const app = express();
require('dotenv').config();

const privateKey=fs.readFileSync('server.key');
const certificate=fs.readFileSync('server.cert');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); 
app.use(express.static('public'));
app.use(express.static('views'));
//app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://lumberjack.razorpay.com", "https://api.razorpay.com"],  // Allow Razorpay's URLs
      imgSrc: ["'self'"],
      frameSrc: ["'self'", "https://api.razorpay.com"],
    },
  })
);
app.use(cors())


const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
app.use(morgan('combined',{stream: accessLogStream}));


app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchase);
app.use(password);



app.use(morgan('combined',{stream: accessLogStream}));
// Sync the database and start the server
//{ force: true }
const PORT = process.env.PORT || 3000;
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log('Server is running on http://localhost:3000');
    });
    // https.createServer({key: privateKey,cert: certificate},app)
    // .listen(PORT, () => {
    //   console.log('Server is running on https://localhost:3000');
    // });

  })
  .catch(err => console.log(err));