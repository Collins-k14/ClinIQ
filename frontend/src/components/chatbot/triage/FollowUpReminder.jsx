import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import Card from '../../common/Card';

export default function FollowUpReminder({ followUpDate }) {
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const message = followUpDate 
    ? `Schedule a follow-up appointment around ${formatDate(followUpDate)}`
    : 'Consider scheduling a follow-up in 7-14 days to monitor your symptoms';
  
  return (
    <Card className="bg-yellow-50 border border-yellow-200 mb-6">
      <div className="flex items-center space-x-2 mb-2">
        <ClockIcon className="h-5 w-5 text-yellow-600" />
        <h3 className="text-lg font-semibold text-yellow-900">
          Follow-up Recommended
        </h3>
      </div>
      <p className="text-yellow-800">{message}</p>
    </Card>
  );
}
