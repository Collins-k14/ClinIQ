import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Get severity configuration including colors, icons, and messages
 * @param {string} severity - 'emergency', 'severe', 'moderate', or 'mild'
 * @returns {object} Configuration object with styling and content
 */
export const getSeverityConfig = (severity) => {
  const configs = {
    emergency: {
      color: 'bg-red-100 border-red-300 text-red-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-600',
      badgeVariant: 'danger',
      title: '🚨 Seek Emergency Care Immediately',
      description: 'Your symptoms require immediate medical attention. Please call emergency services or go to the nearest emergency room.'
    },
    severe: {
      color: 'bg-orange-100 border-orange-300 text-orange-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-orange-600',
      badgeVariant: 'warning',
      title: '⚠️ Urgent Care Needed',
      description: 'You should see a healthcare provider as soon as possible, ideally within the next few hours.'
    },
    moderate: {
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      icon: InformationCircleIcon,
      iconColor: 'text-yellow-600',
      badgeVariant: 'warning',
      title: '📋 Medical Consultation Recommended',
      description: 'Consider scheduling an appointment with a healthcare provider within the next few days.'
    },
    mild: {
      color: 'bg-green-100 border-green-300 text-green-800',
      icon: CheckCircleIcon,
      iconColor: 'text-green-600',
      badgeVariant: 'success',
      title: '✅ Self-Care May Be Sufficient',
      description: 'Your symptoms appear mild. Try self-care measures first, but monitor for changes.'
    }
  };
  
  return configs[severity] || configs.moderate;
};

/**
 * Format severity level for display
 * @param {string} severity 
 * @returns {string}
 */
export const formatSeverity = (severity) => {
  return severity ? severity.charAt(0).toUpperCase() + severity.slice(1) : 'Unknown';
};

/**
 * Get urgency color based on level
 * @param {number} level - Urgency level 1-5
 * @returns {string} Tailwind color class
 */
export const getUrgencyColor = (level) => {
  if (level >= 5) return 'text-red-600';
  if (level >= 4) return 'text-orange-600';
  if (level >= 3) return 'text-yellow-600';
  return 'text-green-600';
};