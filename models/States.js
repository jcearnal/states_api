const mongoose = require('mongoose');

// Define schema for the state data
const stateSchema = new mongoose.Schema({
    stateCode: {
        type: String,
        required: true,  // State code must be provided
        unique: true,    // Each state code must be unique in the database
        trim: true,      // Trims whitespace from the state code
        uppercase: true  // Converts state code to uppercase to ensure consistency
    },
    funfacts: [String]  // Array of fun facts about the state, each fun fact is a string
});

// Create a model from the schema
const State = mongoose.model('State', stateSchema);

module.exports = State;  // Export the State model for use in other parts of the application
