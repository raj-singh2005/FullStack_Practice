const Authority = require('../models/Authority.model');
const bcrypt = require('bcryptjs');

// 1. Register an Authority (Officer)
const registerAuthority = async (req, res) => {
    try {
        const { 
            username, 
            email, 
            password, 
            phoneNumber, 
            organization, 
            designation, 
            idProofNumber 
        } = req.body;

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAuthority = new Authority({
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            organization,
            designation,
            idProofNumber
        });

        await newAuthority.save();
        res.status(201).json({ 
            message: "Authority registered successfully!", 
            authorityId: newAuthority._id 
        });
    } catch (err) {
        res.status(400).json({ 
            message: "Registration failed", 
            error: err.message 
        });
    }
};

// 2. Login for Authority
const loginAuthority = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the authority by official email
        const authority = await Authority.findOne({ email });
        if (!authority) {
            return res.status(401).json({ message: "Invalid official email or password" });
        }

        // Compare hashed password with the login attempt
        const isMatch = await bcrypt.compare(password, authority.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid official email or password" });
        }

        // Send back info for the Authority Dashboard
        res.json({ 
            message: "Authority Login successful!", 
            authority: { 
                id: authority._id, 
                username: authority.username,
                organization: authority.organization,
                designation: authority.designation,
                isAuthority: true 
            } 
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during login", error: err.message });
    }
};

// 3. Get Authority Profile
const getAuthorityProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Find by ID and remove the password field from the result
        const authority = await Authority.findById(id).select('-password');

        if (!authority) {
            return res.status(404).json({ message: "Authority account not found" });
        }

        res.json(authority);
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching authority profile", 
            error: err.message 
        });
    }
};

module.exports = {
    registerAuthority,
    loginAuthority,
    getAuthorityProfile,
};