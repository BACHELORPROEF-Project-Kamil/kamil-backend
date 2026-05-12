const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    total_checks: {
        type: Number,
        default: 0
    },
    phishing_warnings: {
        type: Number,
        default: 0
    },
    last_active: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);