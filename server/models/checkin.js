const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Core wellness metrics
    mood: {
        type: String,
        required: true,
        enum: ['Excellent', 'Good', 'Okay', 'Poor', 'Terrible']
    },
    energy: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    soreness: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    
    // Sleep tracking
    sleepHours: {
        type: Number,
        min: 0,
        max: 24
    },
    sleepQuality: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Terrible']
    },
    
    // Stress and recovery
    stressLevel: {
        type: Number,
        min: 1,
        max: 10
    },
    recovery: {
        type: String,
        enum: ['Fully Recovered', 'Mostly Recovered', 'Somewhat Recovered', 'Still Sore', 'Very Sore']
    },
    
    // Hydration and nutrition
    hydration: {
        type: Number,
        min: 1,
        max: 10,
        description: 'How well hydrated do you feel?'
    },
    nutritionQuality: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor']
    },
    
    // Fitness and goals
    workoutMotivation: {
        type: Number,
        min: 1,
        max: 10
    },
    fitnessGoal: {
        type: String,
        enum: ['Muscle Gain', 'Fat Loss', 'Endurance', 'Strength', 'General Fitness', 'Recovery']
    },
    
    // Additional notes
    notes: {
        type: String,
        maxlength: 500
    },
    
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Checkin = mongoose.model("Checkin", checkinSchema);

module.exports = Checkin;

