const mongoose = require('mongoose');

const AuthoritySchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'Official email is required'], 
        unique: true,
        lowercase: true 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'] 
    },
    phoneNumber: { 
        type: String, 
        required: [true, 'Contact number is required'] 
    },
    
    // --- Professional Fields (The "Proof") ---
    organization: { 
        type: String, 
        required: [true, 'Organization name (e.g., JMC) is required'] 
    },
    designation: { 
        type: String, 
        required: [true, 'Job title/Designation is required'] 
    },
    idProofNumber: { 
        type: String, 
        required: [true, 'Government ID or Employee ID is required'],
        unique: true 
    },
    
    // --- Role Logic ---
    isAuthority: { 
        type: Boolean, 
        default: true 
    }
}, { 
    timestamps: true // Tracks when the officer joined the platform
});

module.exports = mongoose.model('Authority', AuthoritySchema);