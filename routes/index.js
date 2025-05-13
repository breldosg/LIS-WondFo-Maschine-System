const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Start new test
router.post('/test/start', dataController.startTest);

// Get current test data
router.get('/test/data', dataController.getTestData);

module.exports = router; 