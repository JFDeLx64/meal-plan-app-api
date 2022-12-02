require('dotenv').config()
require('express-async-errors')

const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const { logger, logEvents } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3008;

const app = express();



app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Connect to database
connectDB()

app.use(logger);

// routes
app.use('/', express.static(path.join(__dirname, 'public')));
// can also use the app.use(express.static('public')) form
app.use('/', require('./routes/root'));

app.use('/users', require('./components/users/userRoutes'))
app.use('/recipes', require('./components/recipes/recipeRoutes'))

// handle if request is not found
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not found' });
  } else {
    res.type('txt').send('404 Not found');
  }
});

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
  })
})

mongoose.connection.on('err', (err) => {
  console.log('Error connecting to MongoDB', err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})