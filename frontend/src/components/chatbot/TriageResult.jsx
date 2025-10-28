import React from 'react';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Card from '../common/Card';
import SeverityAlert from './triage/SeverityAlert';
import EmergencyContact from './triage/EmergencyContact';
import SymptomsList from './triage/SymptomsList';
import SelfCareRecommendations from './triage/SelfCareRecommendations';
import RecommendedCareType from './triage/RecommendedCareType';
import WhenToSeekHelp from './triage/WhenToSeekHelp';
import FollowUpReminder from './triage/FollowUpReminder';
import Disclaimer from './triage/Disclaimer';
import FacilitiesPreview from './triage/FacilitiesPreview';

export default function TriageResults({ 
  result, 
  symptoms, 
  onRestart, 
  onFindFacilities 
}) {
  const showEmergencyContact = 
    result.severity === 'emergency' || result.severity === 'severe';
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessment Complete
          </h1>
          <p className="text-gray-600">
            Based on the symptoms you've described
          </p>
        </div>
        
        {/* Severity Alert */}
        <SeverityAlert 
          severity={result.severity}
          urgencyLevel={result.urgencyLevel}
        />
        
        {/* Emergency Contact - Only for emergency/severe cases */}
        {showEmergencyContact && (
          <EmergencyContact redFlags={result.redFlags} />
        )}
        
        {/* Identified Symptoms */}
        <SymptomsList symptoms={symptoms} />
        
        {/* Self-Care Recommendations */}
        {result.selfCareAdvice && result.selfCareAdvice.length > 0 && (
          <SelfCareRecommendations advice={result.selfCareAdvice} />
        )}
        
        {/* Recommended Care Type */}
        {result.suggestedFacilityType && (
          <RecommendedCareType 
            facilityType={result.suggestedFacilityType}
            specialty={result.suggestedSpecialty}
            waitTime={result.estimatedWaitTime}
          />
        )}
        
        {/* When to Seek Help */}
        <WhenToSeekHelp />
        
        {/* Follow-up Reminder */}
        {result.followUpNeeded && (
          <FollowUpReminder followUpDate={result.followUpDate} />
        )}
        
        {/* Disclaimer */}
        <Disclaimer />
        
        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Button
            variant="primary"
            size="lg"
            onClick={onFindFacilities}
            className="flex items-center justify-center"
          >
            <MapPinIcon className="h-5 w-5 mr-2" />
            Find Nearby Facilities
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onRestart}
            className="flex items-center justify-center"
          >
            Start New Assessment
          </Button>
        </div>
        
        {/* Recommended Facilities Preview */}
        {result.recommendedFacilities && result.recommendedFacilities.length > 0 && (
          <FacilitiesPreview 
            facilities={result.recommendedFacilities}
            onViewAll={onFindFacilities}
          />
        )}
      </div>
    </div>
  );
}