import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Card from '../../common/Card';

export default function Disclaimer() {
  return (
    <Card className="bg-gray-50 border border-gray-200 mb-8">
      <div className="flex items-start space-x-3">
        <InformationCircleIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-900 mb-1">Important Disclaimer</p>
          <p>
            This assessment is for informational purposes only and does not constitute medical advice. 
            It is not a substitute for professional medical evaluation, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions 
            you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </Card>
  );
}
