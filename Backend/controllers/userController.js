const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      profile: user.profile,
      medicalInfo: user.medicalInfo,
      role: user.role,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      bloodType,
      phone,
      address,
      medicalInfo
    } = req.body;

    const user = await User.findOne({ clerkId: req.userId });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Update profile fields
    if (dateOfBirth) user.profile.dateOfBirth = dateOfBirth;
    if (gender) user.profile.gender = gender;
    if (bloodType) user.profile.bloodType = bloodType;
    if (phone) user.profile.phone = phone;

    // Update address
    if (address) {
      user.profile.address = {
        street: address.street || user.profile.address?.street,
        city: address.city || user.profile.address?.city,
        county: address.county || user.profile.address?.county,
        postalCode: address.postalCode || user.profile.address?.postalCode
      };
    }

    // Update medical info
    if (medicalInfo) {
      if (medicalInfo.allergies) {
        user.medicalInfo.allergies = medicalInfo.allergies;
      }
      if (medicalInfo.chronicConditions) {
        user.medicalInfo.chronicConditions = medicalInfo.chronicConditions;
      }
      if (medicalInfo.currentMedications) {
        user.medicalInfo.currentMedications = medicalInfo.currentMedications;
      }
      if (medicalInfo.emergencyContact) {
        user.medicalInfo.emergencyContact = medicalInfo.emergencyContact;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: user.profile,
      medicalInfo: user.medicalInfo
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
};