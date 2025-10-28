import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Card from '../../common/Card';

export default function SelfCareRecommendations({ advice }) {
  if (!advice || advice.length === 0) return null;
  
  return (
    <Card className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <CheckCircleIcon className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Self-Care Recommendations
        </h3>
      </div>
      <ul className="space-y-3">
        {advice.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-600 mr-3 mt-1">✓</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
