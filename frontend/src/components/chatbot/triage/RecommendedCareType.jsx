import React from 'react';
import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import Card from '../../common/Card';

export default function RecommendedCareType({ facilityType, specialty, waitTime }) {
  return (
    <Card className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <MapPinIcon className="h-6 w-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Recommended Care Type
        </h3>
      </div>
      <div className="bg-primary-50 rounded-lg p-4">
        <p className="text-primary-900 font-medium mb-2">
          {facilityType}
        </p>
        {specialty && (
          <p className="text-sm text-primary-700 mb-2">
            Suggested Specialty: <strong>{specialty}</strong>
          </p>
        )}
        {waitTime && (
          <div className="flex items-center text-sm text-primary-700">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Estimated wait time: {waitTime}</span>
          </div>
        )}
      </div>
    </Card>
  );
}