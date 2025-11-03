const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  role: {
    type: String,
    enum: ['patient', 'facility', 'admin'],
    default: 'patient'
  },
  profile: {
    dateOfBirth: Date,
    gender: String,
    bloodType: String,
    address: {
      street: String,
      city: String,
      county: String,
      postalCode: String
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  medicalInfo: {
    allergies: [String],
    chronicConditions: [String],
    currentMedications: [String]
  },
  favoriteFacilities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);