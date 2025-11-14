const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: String,
  type: String,
  address: String,
  phone: String,
  hours: String,
  verified: Boolean,
  premium: Boolean,
  rating: Number,
  reviews: Number,
  services: [String],
  distance: Number,
  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Facility', facilitySchema);
