import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

export default function Alert({ type = 'info', title, message, onClose }) {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircleIcon,
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircleIcon,
      iconColor: 'text-red-600',
      textColor: 'text-red-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    }
  };
  
  const config = types[type];
  const Icon = config.icon;
  
  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 mb-4`}>
      <div className="flex">
        <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5`} />
        <div className="ml-3 flex-1">
          {title && <h3 className={`text-sm font-medium ${config.textColor}`}>{title}</h3>}
          {message && <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className={`ml-3 ${config.iconColor} hover:opacity-75`}>
            <XCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}