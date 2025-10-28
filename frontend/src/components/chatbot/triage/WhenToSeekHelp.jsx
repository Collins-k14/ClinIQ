import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Card from '../../common/Card';

export default function WhenToSeekHelp() {
  const helpItems = [
    "Symptoms worsen or don't improve within a few days",
    "You develop new or concerning symptoms",
    "You have difficulty performing daily activities",
    "You're unsure about the severity of your condition"
  ];
  
  return (
    <Card className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <InformationCircleIcon className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          When to Seek Medical Help
        </h3>
      </div>
      <ul className="space-y-2 text-gray-700">
        {helpItems.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-3">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
