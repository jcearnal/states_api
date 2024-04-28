const router = require('express').Router();
const statesController = require('../controllers/statesController');

// Existing routes
router.get('/', statesController.getAllStates);
router.get('/:stateCode', statesController.getStateDetails);

// Specific data routes
router.get('/:stateCode/funfact', statesController.getFunFacts);
router.get('/:stateCode/capital', statesController.getCapital);
router.get('/:stateCode/nickname', statesController.getNickname);
router.get('/:stateCode/population', statesController.getPopulation);
router.get('/:stateCode/admission', statesController.getAdmission);

// Post, Patch, Delete for funfacts
router.post('/:stateCode/funfact', statesController.addFunFact);
router.patch('/:stateCode/funfact', statesController.updateFunFact);
router.delete('/:stateCode/funfact', statesController.deleteFunFact);

module.exports = router;
