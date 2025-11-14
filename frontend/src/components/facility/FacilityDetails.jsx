import React from 'react';
import { X, MapPin, Phone, Clock, Star, Navigation, CheckCircle, Award } from 'lucide-react';

const FacilityDetails = ({ facility, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">{facility.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {facility.type}
            </span>
            {facility.verified && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
            {facility.premium && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
                <Award className="w-3 h-3" />
                Premium
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-lg">{facility.rating}</span>
            <span className="text-gray-600">({facility.reviews} reviews)</span>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-600" />
                  <span>{facility.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <a href={`tel:${facility.phone}`} className="text-blue-600 hover:underline">
                    {facility.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span>{facility.hours}</span>
                </div>
              </div>
            </div>
            
            {facility.services && (
              <div>
                <h3 className="font-semibold mb-2">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {facility.services.map((service, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {facility.premium && facility.prices && (
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(facility.prices).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Book Appointment
            </button>
            <button 
              onClick={() => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`);
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;