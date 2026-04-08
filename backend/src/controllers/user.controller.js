const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

// 1. Register with Manual Hashing
const registerUser = async (req, res) => {
    try {
        const { username, email, password, phoneNumber, gender, isAuthority } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            gender,
            isAuthority
        });

        await newUser.save();
        res.status(201).send({ message: "User registered safely!", userId: newUser._id });
    } catch (err) {
        res.status(400).send({ message: "Registration failed", error: err.message });
    }
};

// 2. Login with Password Comparison
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ 
            message: "Login successful!", 
            user: { 
                id: user._id.toString(),
                username: user.username,
                isAuthority: user.isAuthority, 
                stars: user.stars 
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Login error", error: err.message });
    }
};

// 3. Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: "Error fetching profile", error: err.message });
    }
};

// ✨ NEW: Award Star (Impact Point) to Citizen
const awardStar = async (req, res) => {
    try {
        const { id } = req.params;

        // $inc: { stars: 1 } adds 1 to the existing value in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $inc: { stars: 1 } }, 
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ 
            message: "Impact Point awarded!", 
            stars: updatedUser.stars 
        });
    } catch (err) {
        console.error("Award Star Error:", err);
        res.status(500).json({ message: "Could not award star", error: err.message });
    }
};

const getUsers = async (req, res) => {
    try {
        // Fetch users, but only get fields we need for the leaderboard
        // .sort({ stars: -1 }) sorts from highest to lowest impact points
        const users = await User.find({ isAuthority: false }) 
            .select('username stars')
            .sort({ stars: -1 });

        res.json(users);
    } catch (err) {
        console.error("Fetch Users Error:", err);
        res.status(500).json({ message: "Error fetching leaderboard data", error: err.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    awardStar, // 👈 Exported
    getUsers
};