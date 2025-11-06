const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, getUserInfo } = require('../middleware/clerkAuth');

router.use(requireAuth);
router.use(getUserInfo);

// Get user&update profile
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
