const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },
    prompt: {
        type: String,
        required: true
    },
    forwardTo: {
        type: String,
        required: true
    },
    simProvider: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;