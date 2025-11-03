const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');
const { requireAuth, getUserInfo } = require('../middleware/clerkAuth');

// Public routes (can work without auth for testing)
router.post('/chat', symptomController.processMessage);
router.post('/check', symptomController.checkSymptoms);
router.get('/common', symptomController.getCommonSymptoms);

// Protected routes (require authentication)
router.use(requireAuth); 
router.use(getUserInfo); 
router.post('/history', symptomController.saveToHistory);
router.get('/history', symptomController.getSymptomHistory);
router.get('/:id', symptomController.getSymptomCheckById);

module.exports = router;