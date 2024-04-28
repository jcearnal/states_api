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

exports.getCapital = async (req, res) => {
    const { stateCode } = req.params;
    const normalizedStateCode = stateCode.toUpperCase();
    const stateData = statesData.find(state => state.code === normalizedStateCode);

    if (!stateData) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: stateData.state, capital: stateData.capital_city });
};

exports.getNickname = async (req, res) => {
    const { stateCode } = req.params;
    const normalizedStateCode = stateCode.toUpperCase();
    const stateData = statesData.find(state => state.code === normalizedStateCode);

    if (!stateData) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: stateData.state, nickname: stateData.nickname });
};

exports.getPopulation = async (req, res) => {
    const { stateCode } = req.params;
    const normalizedStateCode = stateCode.toUpperCase();
    const stateData = statesData.find(state => state.code.toUpperCase() === normalizedStateCode);

    if (!stateData) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // Formatting population with commas for thousands
    const formattedPopulation = stateData.population.toLocaleString();

    res.json({ state: stateData.state, population: formattedPopulation });
};

exports.getAdmission = async (req, res) => {
    const { stateCode } = req.params;
    const normalizedStateCode = stateCode.toUpperCase();
    const stateData = statesData.find(state => state.code === normalizedStateCode);

    if (!stateData) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: stateData.state, admitted: stateData.admission_date });
};

exports.getFunFacts = async (req, res) => {
    const { stateCode } = req.params;
    const normalizedStateCode = stateCode.toUpperCase();
    const stateData = statesData.find(state => state.code.toUpperCase() === normalizedStateCode);

    if (!stateData) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    try {
        const stateFunFacts = await State.findOne({ stateCode: normalizedStateCode });
        if (!stateFunFacts || !stateFunFacts.funfacts || stateFunFacts.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
        }
        // Selecting a random fun fact from the array
        const randomFunFact = stateFunFacts.funfacts[Math.floor(Math.random() * stateFunFacts.funfacts.length)];
        res.json({ funfact: randomFunFact });
    } catch (error) {
        res.status(500).json({ message: `Error fetching fun facts for ${stateData.state}`, error });
    }
};

exports.addFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }
    if (funfacts.length === 0) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }

    const normalizedStateCode = stateCode.toUpperCase();
    try {
        const updatedState = await State.findOneAndUpdate(
            { stateCode: normalizedStateCode },
            { $addToSet: { funfacts: { $each: funfacts } } },
            { new: true, upsert: true }
        );
        if (!updatedState) {
            return res.status(404).json({ message: 'State not found' });
        }
        res.status(201).json(updatedState);
    } catch (error) {
        res.status(500).json({ message: "Error adding fun facts", error });
    }
};

exports.updateFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index, funfact } = req.body;

    if (index === undefined || index < 1) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    const normalizedStateCode = stateCode.toUpperCase();
    try {
        const state = await State.findOne({ stateCode: normalizedStateCode });
        if (!state || (state.funfacts && state.funfacts.length === 0)) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateCode}` });
        }
        if (index > state.funfacts.length || index - 1 < 0) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateCode}` });
        }

        state.funfacts[index - 1] = funfact;
        await state.save();
        res.json(state);
    } catch (error) {
        res.status(500).json({ message: "Error updating fun fact", error });
    }
};

exports.deleteFunFact = async (req, res) => {
    const { stateCode } = req.params;
    const { index } = req.body;

    if (index === undefined || index < 1) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    const normalizedStateCode = stateCode.toUpperCase();
    try {
        const state = await State.findOne({ stateCode: normalizedStateCode });
        if (!state || (state.funfacts && state.funfacts.length === 0)) {
            return res.status(404).json({ message: `No Fun Facts found for ${stateCode}` });
        }
        if (index > state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${stateCode}` });
        }

        state.funfacts.splice(index - 1, 1);
        await state.save();
        res.json(state);
    } catch (error) {
        res.status(500).json({ message: "Error deleting fun fact", error });
    }
};
