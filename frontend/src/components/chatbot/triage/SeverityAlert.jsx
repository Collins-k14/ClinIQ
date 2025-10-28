import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { getSeverityConfig } from '../../../Utils/triageHelpers';

export default function SeverityAlert({ severity, urgencyLevel }) {
  const config = getSeverityConfig(severity);
  const Icon = config.icon;
  
  return (
    <Card className={`border-2 ${config.color} mb-6`}>
      <div className="flex items-start space-x-4">
        <Icon className={`h-8 w-8 ${config.iconColor} flex-shrink-0 mt-1`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">
              {config.title}
            </h2>
            <Badge variant={config.badgeVariant} size="lg">
              {severity.toUpperCase()}
            </Badge>
          </div>
          <p className="text-base mb-4">
            {config.description}
          </p>
          
          {urgencyLevel && (
            <div className="flex items-center text-sm">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>
                Urgency Level: <strong>{urgencyLevel}/5</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
