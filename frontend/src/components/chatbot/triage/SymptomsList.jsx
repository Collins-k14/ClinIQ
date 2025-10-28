import React from 'react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';

export default function SymptomsList({ symptoms }) {
  if (!symptoms || symptoms.length === 0) return null;
  
  return (
    <Card className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Identified Symptoms
      </h3>
      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom, index) => (
          <Badge key={index} variant="default" size="md">
            {symptom}
          </Badge>
        ))}
      </div>
    </Card>
  );
}