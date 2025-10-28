import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';

export default function FacilitiesPreview({ facilities, onViewAll }) {
  if (!facilities || facilities.length === 0) return null;
  
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recommended Facilities Near You
      </h3>
      <div className="space-y-3">
        {facilities.slice(0, 3).map((facility, index) => (
          <FacilityPreviewCard key={index} facility={facility} />
        ))}
      </div>
      <Button
        variant="outline"
        fullWidth
        onClick={onViewAll}
        className="mt-4"
      >
        View All Facilities
      </Button>
    </Card>
  );
}
// Facility Preview Card Sub-Component
function FacilityPreviewCard({ facility }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{facility.name}</h4>
          <p className="text-sm text-gray-600">{facility.type}</p>
        </div>
        <Badge variant="success" size="sm">
          {facility.status || 'Open'}
        </Badge>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <MapPinIcon className="h-4 w-4 mr-1" />
        <span>{facility.distance} km away</span>
      </div>
      {facility.specialties && facility.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {facility.specialties.slice(0, 3).map((specialty, idx) => (
            <Badge key={idx} variant="default" size="sm">
              {specialty}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
