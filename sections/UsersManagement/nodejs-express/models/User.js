const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creating the user Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userType: {
        type: String,
        default: 'user' // 'user' or 'admin'
    }
});

User = mongoose.model("users", UserSchema);

module.exports = User;