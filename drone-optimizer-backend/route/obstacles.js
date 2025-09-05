const express = require('express');
const router = express.Router();
const { addObstacle, getObstacles } = require('../controllers/obstaclesController');

router.post('/', addObstacle);
router.get('/', getObstacles);

module.exports = router;
