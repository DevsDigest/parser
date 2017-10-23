'use strict';

const mongoose = require('mongoose');
const config = require('./config');
const db = mongoose.connection;

db.openUri(config.MONGODB_URI);

db.on('connected', console.log.bind(console, 'Mongoose default connection open to ' + config.MONGODB_URI));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('disconnected', console.log.bind(console, 'Mongoose default connection disconnected'));

process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = db;
