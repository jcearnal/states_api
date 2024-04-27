const statesData = require('../models/statesData.json');  // Import states data from JSON file

// Create an array of state codes from the imported states data
const stateCodes = statesData.map(state => state.stateCode);

// Middleware function to validate state code in request parameters
function verifyStates(req, res, next) {
    const { state } = req.params;  // Extract the state code from request parameters
    // Check if the provided state code exists in our list of state codes
    if (!stateCodes.includes(state.toUpperCase())) {
        // If state code is invalid, return a 404 error with a message
        return res.status(404).send({ error: 'Invalid state code' });
    }
    // If valid, normalize the state code to uppercase and attach to request object
    req.stateCode = state.toUpperCase();
    next();  // Proceed to the next middleware or request handler
}

module.exports = verifyStates;  // Export the function for use as middleware in routes
