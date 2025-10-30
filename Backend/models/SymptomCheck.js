const mongoose = require('mongoose');

const symptomCheckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous checks
  },
  symptoms: [{
    type: String,
    required: true
  }],
  conversation: [{
    role: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  triageResult: {
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'emergency'],
      required: true
    },
    urgencyLevel: {
      type: Number,
      min: 1,
      max: 5
    },
    recommendation: String,
    selfCareAdvice: [String],
    suggestedSpecialty: String,
    redFlags: [String],
    followUpNeeded: Boolean,
    followUpDate: Date
  },
  recommendedFacilities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility'
  }]
}, {
  timestamps: true
});

// Index for faster queries
symptomCheckSchema.index({ userId: 1, createdAt: -1 });
symptomCheckSchema.index({ 'triageResult.severity': 1 });

module.exports = mongoose.model('SymptomCheck', symptomCheckSchema);