const Facility = require('../models/Facility');

// @desc Get all facilities
// @route GET /api/facilities
// @access Public
exports.getFacilities = async (req, res) => {
  try {
    const { type, verifiedOnly, nearbyOnly, twentyFourHour } = req.query;

    let query = {};

    if (type && type !== 'All') query.type = type;
    if (verifiedOnly === 'true') query.verified = true;
    if (twentyFourHour === 'true') query.hours = '24/7';

    const facilities = await Facility.find(query);

    // You can filter nearbyOnly later when adding user location
    res.json(facilities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
