const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: String, // It should be inserted encrypted
    firstName: String,
    lastName: String,
    role: {
        type: String,
        enum: ['ADMIN', 'USER']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    activated: {
        type: String,
        enum: ["PENDING", "ACTIVE"],
        default: "PENDING"
    }
});

module.exports = mongoose.model('user', UserModelSchema);