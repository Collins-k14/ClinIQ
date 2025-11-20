import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PrinterIcon,
  ShareIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  StarIcon as StarOutline,
  BellAlertIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, CheckBadgeIcon } from '@heroicons/react/24/solid';

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/appointments/${id}`);
        setAppointment(res.data.appointment);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch appointment details');
        toast.error('Failed to fetch appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

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

  const getDaysUntilAppointment = (dateString) => {
    const appointmentDate = new Date(dateString);
    const today = new Date();
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Appointment Details',
        text: `Appointment at ${facility?.name} on ${formatDate(appointment?.date)}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCancel = async () => {
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled successfully');
      setShowCancelModal(false);
      // Redirect or update UI
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || 'Appointment not found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {error ? 'We couldn\'t load your appointment details' : 'The appointment you\'re looking for doesn\'t exist'}
          </p>
          <Link
            to="/appointments"
            className="btn bg-primary-600 text-white hover:bg-primary-700 px-6 py-2"
          >
            Back to Appointments
          </Link>
        </div>
      </div>
    );
  }

  const facility = appointment.facilityId || {};
  const daysUntil = getDaysUntilAppointment(appointment.date);
  const isPast = daysUntil < 0;
  const isToday = daysUntil === 0;
  const isUpcoming = daysUntil > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/appointments"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Back to Appointments</span>
        </Link>

        {/* Status Banner */}
        {isToday && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center">
              <BellAlertIcon className="h-6 w-6 mr-3 animate-pulse" />
              <div>
                <p className="font-semibold text-lg">Your appointment is today!</p>
                <p className="text-green-100 text-sm">Please arrive 15 minutes early</p>
              </div>
            </div>
          </div>
        )}

        {isUpcoming && daysUntil <= 3 && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 mr-3" />
              <div>
                <p className="font-semibold text-lg">Upcoming Appointment</p>
                <p className="text-blue-100 text-sm">
                  {daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                </p>
              </div>
            </div>
          </div>
        )}

        {isPast && (
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 mr-3" />
                <div>
                  <p className="font-semibold text-lg">Past Appointment</p>
                  <p className="text-gray-100 text-sm">This appointment has been completed</p>
                </div>
              </div>
              <button className="btn bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-none px-4 py-2">
                Leave Review
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Facility Header with Gradient */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold">{facility.name || 'Healthcare Facility'}</h2>
                        <CheckBadgeIcon className="h-6 w-6 text-green-300" />
                      </div>
                      {facility.address && (
                        <div className="flex items-center text-primary-100 mb-2">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{facility.address}</span>
                        </div>
                      )}
                      {facility.phone && (
                        <div className="flex items-center text-primary-100">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{facility.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Large Date Display */}
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-100 text-sm mb-1">Appointment Date & Time</p>
                        <p className="text-2xl font-bold">{formatDate(appointment.date)}</p>
                        <p className="text-xl font-semibold text-primary-100 mt-1">{formatTime(appointment.time)}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-white text-primary-600 rounded-lg px-4 py-2">
                          <p className="text-3xl font-bold">{new Date(appointment.date).getDate()}</p>
                          <p className="text-xs font-semibold uppercase">
                            {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Appointment Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <DetailCard
                    icon={UserGroupIcon}
                    label="Service"
                    value={appointment.service}
                    color="blue"
                  />
                  <DetailCard
                    icon={BuildingOffice2Icon}
                    label="Facility Type"
                    value={facility.type || 'Medical Center'}
                    color="green"
                  />
                  <DetailCard
                    icon={CalendarIcon}
                    label="Day"
                    value={new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    color="purple"
                  />
                  <DetailCard
                    icon={ClockIcon}
                    label="Duration"
                    value="30-45 minutes"
                    color="orange"
                  />
                </div>

                {/* Location Map Placeholder */}
                {facility.address && (
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">Location</p>
                        <p className="text-gray-700 mb-3">{facility.address}</p>
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          Get Directions
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Important Information */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationCircleIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Important Reminders</h4>
                      <ul className="text-sm text-blue-800 space-y-1.5">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Arrive 15 minutes before your scheduled time</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Bring a valid ID and insurance card (if applicable)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Bring any relevant medical records or test results</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>Wear a mask if you have respiratory symptoms</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isUpcoming && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Appointment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="btn bg-primary-600 text-white hover:bg-primary-700 py-3 flex items-center justify-center">
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    Reschedule
                  </button>
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="btn bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 py-3 flex items-center justify-center"
                  >
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handlePrint}
                  className="w-full btn bg-gray-50 text-gray-700 hover:bg-gray-100 py-2.5 flex items-center justify-center border border-gray-200"
                >
                  <PrinterIcon className="h-5 w-5 mr-2" />
                  Print Details
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full btn bg-gray-50 text-gray-700 hover:bg-gray-100 py-2.5 flex items-center justify-center border border-gray-200"
                >
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share
                </button>
                <button className="w-full btn bg-gray-50 text-gray-700 hover:bg-gray-100 py-2.5 flex items-center justify-center border border-gray-200">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  Email Reminder
                </button>
              </div>
            </div>

            {/* Contact Facility */}
            {facility.phone && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
                <p className="text-green-100 text-sm mb-4">
                  Contact the facility directly if you have questions
                </p>
                <a
                  href={`tel:${facility.phone}`}
                  className="w-full btn bg-white text-green-600 hover:bg-green-50 py-2.5 flex items-center justify-center font-semibold"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Call Facility
                </a>
              </div>
            )}

            {/* Facility Rating */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Facility Rating</h3>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarSolid
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">4.8</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Based on 342 reviews</p>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                <StarOutline className="h-4 w-4 mr-1" />
                View All Reviews
              </button>
            </div>

            {/* Additional Services */}
            {facility.services && facility.services.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Services</h3>
                <div className="space-y-2">
                  {facility.services.slice(0, 4).map((service, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="bg-red-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Appointment?</h3>
              <p className="text-gray-600">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 py-3"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 btn bg-red-600 text-white hover:bg-red-700 py-3"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Detail Card Component
function DetailCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-0.5">{label}</p>
          <p className="font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;