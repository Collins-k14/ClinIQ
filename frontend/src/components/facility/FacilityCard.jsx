import React from 'react';
import { MapPin, Star, Clock, Phone, Navigation, Award, CheckCircle } from 'lucide-react';

const FacilityCard = ({ facility, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{facility.name}</h3>
            {facility.verified && (
              <CheckCircle className="w-4 h-4 text-blue-500" />
            )}
            {facility.premium && (
              <Award className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">{facility.type}</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{facility.rating}</span>
          <span className="text-sm text-gray-500">({facility.reviews})</span>
        </div>
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="flex items-start gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{facility.address} • {facility.distance}km away</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>{facility.hours}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span>{facility.phone}</span>
        </div>
      </div>
      
      {facility.premium && facility.services && (
        <div className="flex flex-wrap gap-1 mb-3">
          {facility.services.slice(0, 3).map((service, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {service}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle booking
          }}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Book Appointment
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;