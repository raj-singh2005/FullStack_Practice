const Event = require('../models/Event.model');
const User = require('../models/User.model');

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, creatorId, isAuthority } = req.body;
        
        const newEvent = new Event({
            title,
            description,
            date,
            time,
            location,
            creator: creatorId,
            onModel: isAuthority ? 'Authority' : 'User'
        });

        await newEvent.save();
        res.status(201).json({ message: "Event successfully hosted!", data: newEvent });
    } catch (err) {
        res.status(500).json({ message: "Event creation failed", error: err.message });
    }
};

// Get Filtered Events
exports.getEvents = async (req, res) => {
    try {
        const { type, userId } = req.query; 
        let query = {};

        if (type === 'active') query.status = 'active';
        if (type === 'closed') query.status = 'closed';
        if (type === 'hosted') query.creator = userId;
        if (type === 'joined') query.volunteers = userId;

        const events = await Event.find(query)
            .populate('creator', 'username organization designation')
            .populate('volunteers', 'username stars')
            .sort({ date: 1 });

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Fetch failed", error: err.message });
    }
};

// Join Event (Volunteering)
exports.joinEvent = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        // Use $addToSet so a user can't join twice
        const event = await Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { volunteers: userId } },
            { new: true }
        );
        // Award 2 stars for volunteering!
        await User.findByIdAndUpdate(userId, { $inc: { stars: 2 } });
        res.json({ message: "You are now a volunteer!", data: event });
    } catch (err) {
        res.status(500).json({ message: "Join failed", error: err.message });
    }
};

// Fund Event (Corrected & Merged)
exports.fundEvent = async (req, res) => {
    try {
        const { eventId, userId, amount } = req.body;
        const numAmount = Number(amount);

        const event = await Event.findByIdAndUpdate(
            eventId,
            { 
                $inc: { totalFund: numAmount }, // 💰 Increases the global total
                $push: { funders: { user: userId, amount: numAmount } } // 📝 Records who paid
            },
            { new: true }
        );

        // Award 5 stars for financial support!
        await User.findByIdAndUpdate(userId, { $inc: { stars: 5 } });
        
        res.json({ message: "Thank you for your contribution!", data: event });
    } catch (err) {
        res.status(500).json({ message: "Funding failed", error: err.message });
    }
};