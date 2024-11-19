require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const routerHandler = require('./routes/courses_route');
const httpStatusText = require('./utils/httpStatusText');
const usersRoute = require('./routes/users_route');
const path = require('path');

const url = process.env.DB_URL;

mongoose.connect(url).then(() => {
  console.log('Connected to database');
});

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/courses', routerHandler); //api/courses
app.use('/api/users', usersRoute); //api/users

app.all('*', (req, res, next) => {
  return res
    .status(404)
    .json({ status: httpStatusText.ERORR, message: 'Not Available Resource' });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERORR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT || 5000, () => {
  console.log('Running on Port 5000');
});
