const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/habitTracker')
  .then(() => console.log('Connected to db!'));

module.exports = mongoose.connection;