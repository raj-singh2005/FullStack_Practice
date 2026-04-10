const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    
    // The "Who" - Dynamic reference to either Collection
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'onModel' 
    },
    onModel: { 
        type: String, 
        required: true, 
        enum: ['User', 'Authority'] 
    },

    // Community Interaction
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    funders: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number, default: 0 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);