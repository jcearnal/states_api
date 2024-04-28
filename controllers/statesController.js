const State = require('../models/States');
const statesData = require('../models/statesData.json');

async function fetchStateFunFacts() {
    return await State.find({});
}

exports.getAllStates = async (req, res) => {
    let filteredStates;
    if (req.query.contig === 'true') {
        // Exclude AK and HI for contiguous states
        filteredStates = statesData.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (req.query.contig === 'false') {
        // Include only AK and HI for non-contiguous states
        filteredStates = statesData.filter(state => state.code === 'AK' || state.code === 'HI');
    } else {
        // No contig parameter provided, return all states
        filteredStates = statesData;
    }

    try {
        const funFacts = await fetchStateFunFacts();
        const result = filteredStates.map(state => ({
            ...state,
            funfacts: funFacts.find(ff => ff.stateCode === state.code)?.funfacts || []
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching state data", error });
    }
};

exports.getStateDetails = async (req, res) => {
    const { stateCode } = req.params;
    const normalizedStateCode = stateCode.toUpperCase(); // Ensure case-insensitivity
    const stateData = statesData.find(state => state.code.toUpperCase() === normalizedStateCode);
    
    if (!stateData) {
        // Handles invalid state abbreviation and non-existent state codes
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    try {
        const stateFunFacts = await State.findOne({ stateCode: normalizedStateCode });
        const responseData = { ...stateData, funfacts: stateFunFacts ? stateFunFacts.funfacts : [] };

        // Check if funfacts should not be included
        if (['NH', 'RI'].includes(normalizedStateCode)) {
            delete responseData.funfacts; // Remove funfacts property for NH and RI
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching state details", error });
    }
};

exports.getFunFacts = async (req, res) => {
    const { stateCode } = req.params;
    const normalizedStateCode = stateCode.toUpperCase();
    const stateData = statesData.find(state => state.code === normalizedStateCode);

    if (!stateData) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    try {
        const stateFunFacts = await State.findOne({ stateCode: normalizedStateCode });
        if (!stateFunFacts || !stateFunFacts.funfacts || stateFunFacts.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateData.name}` });
        }
        res.json({ state: stateData.name, funfacts: stateFunFacts.funfacts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching fun facts", error });
    }
};


exports.addFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { funfacts } = req.body;
    if (!funfacts || funfacts.length === 0) {
        return res.status(400).json({ error: 'No fun facts provided' });
    }
    try {
        const updatedState = await State.findOneAndUpdate(
            { stateCode },
            { $addToSet: { funfacts: { $each: funfacts } } },
            { new: true, upsert: true }
        );
        res.status(201).json(updatedState);
    } catch (error) {
        res.status(500).json({ message: "Error adding fun facts", error });
    }
};

exports.updateFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { funfacts } = req.body;

    try {
        const state = await State.findOneAndUpdate(
            { stateCode: stateCode.toUpperCase() },
            { $set: { funfacts: funfacts } },  // or use $push to add to existing funfacts
            { new: true, upsert: true }
        );
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }
        res.json(state);
    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};


exports.deleteFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index } = req.body;  // Make sure 'index' is being correctly pulled from the body

    if (!index) {  // Check that 'index' is not undefined, null, or zero
        return res.status(400).json({ error: 'Index required' });
    }

    try {
        const state = await State.findOne({ stateCode: stateCode.toUpperCase() });
        if (!state || !state.funfacts[index - 1]) {
            return res.status(404).json({ error: 'Fun fact not found' });
        }
        // Remove the fun fact at the specified index
        state.funfacts.splice(index - 1, 1);
        await state.save();
        res.json({ success: true, message: 'Fun fact deleted successfully', state });
    } catch (error) {
        res.status(500).json({ message: "Error deleting fun fact", error });
    }
};

