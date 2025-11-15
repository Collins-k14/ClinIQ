const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { requireAuth,getUserInfo } = require('../middleware/clerkAuth'); // middleware to verify Clerk JWT

// CREATE appointment - userId is automatically from logged-in user
router.post('/', requireAuth, getUserInfo, async (req, res) => {
  try {
    const { facilityId, service, date, time } = req.body;

    // Ensure required fields are provided
    if (!facilityId || !service || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const appointment = new Appointment({
      userId: req.userId, // automatically set from Clerk token
      facilityId,
      service,
      date,
      time
    });

    await appointment.save();
    res.json({ success: true, appointment });

  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET appointments for a specific user
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    // Make sure the user can only access their own appointments
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const appointments = await Appointment.find({ userId: req.params.userId })
      .populate('facilityId', 'name address phone');

    res.json({ success: true, appointments });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ error: err.message });
  }
});

// CANCEL appointment
router.put('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Ensure user can only cancel their own appointment
    if (appointment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, appointment });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
