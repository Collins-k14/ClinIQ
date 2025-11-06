import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react'; // If using Clerk
import { 
  UserCircleIcon, 
  CalendarIcon,
  HeartIcon,
  BeakerIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user: clerkUser, isLoaded } = useUser(); // Clerk user
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Info (from your DB)
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    phone: '',
    
    // Address
    address: {
      street: '',
      city: '',
      county: '',
      postalCode: ''
    },
    
    // Medical Info
    medicalInfo: {
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    }
  });
  
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    if (isLoaded && clerkUser) {
      loadProfile();
    }
  }, [isLoaded, clerkUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      
      // Merge with default structure
      setProfileData({
        dateOfBirth: data.profile?.dateOfBirth || '',
        gender: data.profile?.gender || '',
        bloodType: data.profile?.bloodType || '',
        phone: data.profile?.phone || '',
        address: {
          street: data.profile?.address?.street || '',
          city: data.profile?.address?.city || '',
          county: data.profile?.address?.county || '',
          postalCode: data.profile?.address?.postalCode || ''
        },
        medicalInfo: {
          allergies: data.medicalInfo?.allergies || [],
          chronicConditions: data.medicalInfo?.chronicConditions || [],
          currentMedications: data.medicalInfo?.currentMedications || [],
          emergencyContact: {
            name: data.medicalInfo?.emergencyContact?.name || '',
            relationship: data.medicalInfo?.emergencyContact?.relationship || '',
            phone: data.medicalInfo?.emergencyContact?.phone || ''
          }
        }
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        emergencyContact: {
          ...prev.medicalInfo.emergencyContact,
          [name]: value
        }
      }
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setProfileData(prev => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo,
          allergies: [...prev.medicalInfo.allergies, newAllergy.trim()]
        }
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index) => {
    setProfileData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        allergies: prev.medicalInfo.allergies.filter((_, i) => i !== index)
      }
    }));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setProfileData(prev => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo,
          chronicConditions: [...prev.medicalInfo.chronicConditions, newCondition.trim()]
        }
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (index) => {
    setProfileData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        chronicConditions: prev.medicalInfo.chronicConditions.filter((_, i) => i !== index)
      }
    }));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setProfileData(prev => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo,
          currentMedications: [...prev.medicalInfo.currentMedications, newMedication.trim()]
        }
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (index) => {
    setProfileData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        currentMedications: prev.medicalInfo.currentMedications.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      profileData.dateOfBirth,
      profileData.gender,
      profileData.bloodType,
      profileData.phone,
      profileData.address.city,
      profileData.medicalInfo.allergies.length > 0,
      profileData.medicalInfo.emergencyContact.name
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Health Profile</h1>
          <p className="text-gray-600 mt-2">
            Complete your profile for personalized health recommendations
          </p>
        </div>

        {/* Profile Completion Alert */}
        {completionPercentage < 100 && (
          <Alert
            type="warning"
            title={`Profile ${completionPercentage}% Complete`}
            message="Complete your profile to get personalized health recommendations and better care."
          />
        )}

        {/* User Info Card */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b">
            <div className="relative">
              {clerkUser?.imageUrl ? (
                <img
                  src={clerkUser.imageUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-20 w-20 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {clerkUser?.firstName} {clerkUser?.lastName}
              </h2>
              <p className="text-gray-600">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
              
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <Badge variant="primary">Patient</Badge>
                <Badge variant="success">Verified</Badge>
                {completionPercentage === 100 && (
                  <Badge variant="success">
                    <ShieldCheckIcon className="h-4 w-4 inline mr-1" />
                    Complete Profile
                  </Badge>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="text-sm font-medium text-primary-600">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <Button
              variant={isEditing ? 'secondary' : 'outline'}
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  loadProfile(); // Reset changes
                } else {
                  setIsEditing(true);
                }
              }}
              className="flex items-center"
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <UserIcon className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
              </div>
              
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="+254 700 000 000"
                icon={PhoneIcon}
              />
              
              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                icon={CalendarIcon}
              />
              
              <Select
                label="Gender"
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                options={[
                  { value: '', label: 'Select gender' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                ]}
              />
              
              <Select
                label="Blood Type"
                name="bloodType"
                value={profileData.bloodType}
                onChange={handleInputChange}
                disabled={!isEditing}
                options={[
                  { value: '', label: 'Select blood type' },
                  { value: 'A+', label: 'A+' },
                  { value: 'A-', label: 'A-' },
                  { value: 'B+', label: 'B+' },
                  { value: 'B-', label: 'B-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' }
                ]}
              />
            </Card>

            {/* Address */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <MapPinIcon className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Address
                </h3>
              </div>
              
              <Input
                label="Street Address"
                name="street"
                value={profileData.address.street}
                onChange={handleAddressChange}
                disabled={!isEditing}
                placeholder="123 Main Street"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={profileData.address.city}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="Nairobi"
                />
                
                <Input
                  label="County"
                  name="county"
                  value={profileData.address.county}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="Nairobi"
                />
              </div>
              
              <Input
                label="Postal Code"
                name="postalCode"
                value={profileData.address.postalCode}
                onChange={handleAddressChange}
                disabled={!isEditing}
                placeholder="00100"
              />
            </Card>
          </div>

          {/* Right Column - Medical Info */}
          <div className="space-y-6">
            {/* Medical Information */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <HeartIcon className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Medical Information
                </h3>
              </div>
              
              {/* Allergies */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.medicalInfo.allergies.map((allergy, index) => (
                    <Badge key={index} variant="warning" className="flex items-center space-x-1">
                      <span>{allergy}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeAllergy(index)}
                          className="ml-1 hover:text-red-700"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {profileData.medicalInfo.allergies.length === 0 && (
                    <span className="text-sm text-gray-500">No allergies listed</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                      placeholder="Add allergy"
                      className="input-field flex-1"
                    />
                    <Button size="sm" onClick={addAllergy}>
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Chronic Conditions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chronic Conditions
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.medicalInfo.chronicConditions.map((condition, index) => (
                    <Badge key={index} variant="default" className="flex items-center space-x-1">
                      <span>{condition}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeCondition(index)}
                          className="ml-1 hover:text-red-700"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {profileData.medicalInfo.chronicConditions.length === 0 && (
                    <span className="text-sm text-gray-500">No conditions listed</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                      placeholder="Add condition"
                      className="input-field flex-1"
                    />
                    <Button size="sm" onClick={addCondition}>
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Current Medications */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.medicalInfo.currentMedications.map((medication, index) => (
                    <Badge key={index} variant="primary" className="flex items-center space-x-1">
                      <BeakerIcon className="h-3 w-3" />
                      <span>{medication}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeMedication(index)}
                          className="ml-1 hover:text-red-700"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {profileData.medicalInfo.currentMedications.length === 0 && (
                    <span className="text-sm text-gray-500">No medications listed</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                      placeholder="Add medication"
                      className="input-field flex-1"
                    />
                    <Button size="sm" onClick={addMedication}>
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <PhoneIcon className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Emergency Contact
                </h3>
              </div>
              
              <Input
                label="Contact Name"
                name="name"
                value={profileData.medicalInfo.emergencyContact.name}
                onChange={handleEmergencyContactChange}
                disabled={!isEditing}
                placeholder="John Doe"
              />
              
              <Input
                label="Relationship"
                name="relationship"
                value={profileData.medicalInfo.emergencyContact.relationship}
                onChange={handleEmergencyContactChange}
                disabled={!isEditing}
                placeholder="Spouse, Parent, Sibling"
              />
              
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={profileData.medicalInfo.emergencyContact.phone}
                onChange={handleEmergencyContactChange}
                disabled={!isEditing}
                placeholder="+254 700 000 000"
              />
            </Card>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <Card className="mt-6">
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  loadProfile();
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Health Recommendations */}
        {completionPercentage === 100 && (
          <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Personalized Recommendations
                </h3>
                <p className="text-gray-700 mb-4">
                  Based on your complete profile, here are some health recommendations:
                </p>
                <ul className="space-y-2">
                  {profileData.medicalInfo.allergies.length > 0 && (
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">
                        Keep your allergy list updated and inform healthcare providers about your allergies
                      </span>
                    </li>
                  )}
                  {profileData.bloodType && (
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">
                        Your blood type ({profileData.bloodType}) is recorded for emergency situations
                      </span>
                    </li>
                  )}
                  {profileData.medicalInfo.chronicConditions.length > 0 && (
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">
                        Regular check-ups recommended for managing your chronic conditions
                      </span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      Use the symptom checker for personalized health assessments
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
