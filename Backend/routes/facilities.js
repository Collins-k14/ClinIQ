const express = require('express');
const router = express.Router();
const { getFacilities } = require('../controllers/facilityController');

router.get('/', getFacilities);

module.exports = router;
