const express = require('express');
const router = express.Router();
const { addLocation, getLocations } = require('../controllers/locationsController');

router.post('/', addLocation);
router.get('/', getLocations);

module.exports = router;
