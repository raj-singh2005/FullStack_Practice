const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    stars: {
        type: Number,
        default: 0 // Everyone starts at zero credibility
    },
    isAuthority: {
        type: Boolean,
        default: false // Most signups will be regular citizens
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);