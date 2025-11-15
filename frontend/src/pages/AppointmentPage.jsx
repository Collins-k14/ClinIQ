import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchFacilities } from '../services/facilityApi';
import api from '../services/api';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  StarIcon as StarOutline,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const AppointmentPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFacility, setSelectedFacility] = useState(null);
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookingStep, setBookingStep] = useState(1); // 1: select facility, 2: booking form, 3: confirmation

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoading(true);
        const data = await fetchFacilities({});
        setFacilities(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch facilities');
        toast.error('Failed to fetch facilities');
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, []);

  const handleBook = async () => {
    if (!selectedFacility || !service || !date || !time) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await api.post('/appointments', {
        facilityId: selectedFacility._id,
        service,
        date,
        time,
      });
      toast.success('Appointment booked successfully!');
      setBookingStep(3); // Show confirmation
    } catch (err) {
      console.error(err);
      toast.error('Failed to book appointment');
    }
  };

  const handleReset = () => {
    setSelectedFacility(null);
    setService('');
    setDate('');
    setTime('');
    setBookingStep(1);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading facilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
            <XMarkIcon className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Facilities</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn bg-primary-600 text-white hover:bg-primary-700 px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
              <p className="text-gray-600 mt-2">
                {bookingStep === 1 && 'Select a healthcare facility'}
                {bookingStep === 2 && 'Choose your appointment details'}
                {bookingStep === 3 && 'Booking confirmed!'}
              </p>
            </div>
            {selectedFacility && bookingStep !== 3 && (
              <button
                onClick={handleReset}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center space-x-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Facilities</span>
              </button>
            )}
          </div>

          {/* Progress Indicator */}
          {bookingStep !== 3 && (
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    bookingStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Select Facility</span>
                </div>
                <div className={`h-1 w-16 ${bookingStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    bookingStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Book Slot</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Facility Selection */}
        {bookingStep === 1 && !selectedFacility && (
          <>
            {facilities.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <BuildingOffice2Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Facilities Available</h3>
                <p className="text-gray-600">Please check back later or contact support</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map(facility => (
                  <FacilityCard
                    key={facility._id}
                    facility={facility}
                    onSelect={() => {
                      setSelectedFacility(facility);
                      setBookingStep(2);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Step 2: Booking Form */}
        {bookingStep === 2 && selectedFacility && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Facility Header */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedFacility.name}</h2>
                    <div className="flex items-center space-x-4 text-primary-100">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{selectedFacility.address}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{selectedFacility.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <CheckCircleIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="p-6 space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <UserGroupIcon className="h-5 w-5 inline mr-2 text-primary-600" />
                    Select Service
                  </label>
                  <select
                    value={service}
                    onChange={e => setService(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  >
                    <option value="">Choose a service...</option>
                    {selectedFacility.services && selectedFacility.services.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {selectedFacility.services && selectedFacility.services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedFacility.services.slice(0, 5).map(s => (
                        <button
                          key={s}
                          onClick={() => setService(s)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            service === s
                              ? 'bg-primary-600 text-white'
                              : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date & Time Selection */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <CalendarIcon className="h-5 w-5 inline mr-2 text-primary-600" />
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <ClockIcon className="h-5 w-5 inline mr-2 text-primary-600" />
                      Appointment Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                {/* Suggested Time Slots */}
                {!time && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Popular time slots:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {['09:00', '11:00', '14:00', '16:00'].map(slot => (
                        <button
                          key={slot}
                          onClick={() => setTime(slot)}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Card */}
                {service && date && time && (
                  <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-primary-900 mb-3">Appointment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium text-gray-900">{service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-900">{formatDate(date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium text-gray-900">{formatTime(time)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={!service || !date || !time}
                    className="flex-1 btn bg-blue-600 text-white 
           hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all 
           disabled:bg-gray-300 disabled:cursor-not-allowed py-3 text-base font-semibold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {bookingStep === 3 && selectedFacility && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Success Header */}
              <div className="bg-gradient-to-br from-green-500 to-green-700 text-white text-center py-12">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircleIcon className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-green-100">Your appointment has been successfully scheduled</p>
              </div>

              {/* Appointment Details */}
              <div className="p-8">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <BuildingOffice2Icon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Facility</p>
                        <p className="font-medium text-gray-900">{selectedFacility.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Service</p>
                        <p className="font-medium text-gray-900">{service}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium text-gray-900">{formatDate(date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-medium text-gray-900">{formatTime(time)}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{selectedFacility.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Important Information</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• A confirmation email has been sent to your registered email</li>
                    <li>• Please arrive 15 minutes before your appointment</li>
                    <li>• Bring a valid ID and any relevant medical documents</li>
                    <li>• You can reschedule or cancel up to 24 hours before</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 btn bg-primary-600 text-white hover:bg-primary-700 py-3 text-base"
                  >
                    Book Another Appointment
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 text-base"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Facility Card Component
function FacilityCard({ facility, onSelect }) {
  const rating = facility.rating || 4.5;
  const reviews = facility.reviews || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
         onClick={onSelect}>
      {/* Image/Header */}
      <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <BuildingOffice2Icon className="h-20 w-20 text-white opacity-80" />
        <div className="absolute top-4 right-4 bg-white text-primary-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Verified
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {facility.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarSolid
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {rating} {reviews > 0 && `(${reviews} reviews)`}
          </span>
        </div>

        {/* Location & Phone */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-2">{facility.address}</span>
          </div>
          {facility.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
              <span>{facility.phone}</span>
            </div>
          )}
        </div>

        {/* Services */}
        {facility.services && facility.services.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Available Services:</p>
            <div className="flex flex-wrap gap-1">
              {facility.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                >
                  {service}
                </span>
              ))}
              {facility.services.length > 3 && (
                <span className="text-xs text-gray-500 py-1">
                  +{facility.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Book Button */}
        <button className="w-full btn bg-primary-600 text-white hover:bg-primary-700 group-hover:shadow-lg transition-all py-2.5 font-semibold">
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default AppointmentPage;