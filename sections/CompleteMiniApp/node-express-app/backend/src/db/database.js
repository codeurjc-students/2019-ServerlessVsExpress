const mongoose = require('mongoose');
const config = require('../config/config');

// Connection to the DB
mongoose.connect(config.MONGO_DB_CONNECTION_URL, { 
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// Use the global promise library
mongoose.Promise = global.Promise;

// Get the default connection
const db = mongoose.connection;

// Check if there's been any error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;