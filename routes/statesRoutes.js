const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

// Route to handle the main state data request including checking for contiguous or non-contiguous states
router.get('/', statesController.getAllStates);

// Route to get specific state details
router.get('/:stateCode', statesController.getStateDetails);

// Additional specific data routes - adjust according to need or merge into a single function for simplicity
router.get('/:stateCode/funfact', statesController.getStateDetails); 
router.get('/:stateCode/capital', statesController.getStateDetails); 
router.get('/:stateCode/nickname', statesController.getStateDetails);
router.get('/:stateCode/population', statesController.getStateDetails);
router.get('/:stateCode/admission', statesController.getStateDetails);

// Route to add new fun facts to a state
router.post('/:stateCode/funfact', statesController.addFunFact);

// Route to update a specific fun fact of a state
router.patch('/:stateCode/funfact', statesController.updateFunFact);

// Route to delete a specific fun fact of a state
router.delete('/:stateCode/funfact', statesController.deleteFunFact);

module.exports = router;
