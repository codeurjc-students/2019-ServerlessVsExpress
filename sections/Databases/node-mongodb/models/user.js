'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    email: String,
    age: Number
});

module.exports = mongoose.model('User', UserSchema);