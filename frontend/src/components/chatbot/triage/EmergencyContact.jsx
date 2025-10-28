import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import Card from '../../common/Card';

export default function EmergencyContact({ redFlags }) {
  const defaultRedFlags = [
    'Difficulty breathing or chest pain',
    'Severe bleeding that won\'t stop',
    'Loss of consciousness',
    'Severe allergic reaction'
  ];
  
  const flagsToShow = redFlags && redFlags.length > 0 ? redFlags : defaultRedFlags;
  
  return (
    <Card className="bg-red-50 border-2 border-red-300 mb-6">
      <div className="flex items-center space-x-3 mb-3">
        <PhoneIcon className="h-6 w-6 text-red-600" />
        <h3 className="text-lg font-semibold text-red-900">
          Emergency Contact
        </h3>
      </div>
      <div className="space-y-2 text-red-800">
        <p className="font-medium">Call immediately if:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {flagsToShow.map((flag, index) => (
            <li key={index}>{flag}</li>
          ))}
        </ul>
        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-sm font-medium text-gray-900">Emergency Services:</p>
          <p className="text-2xl font-bold text-red-600">999 / 911 / 112</p>
        </div>
      </div>
    </Card>
  );
}
