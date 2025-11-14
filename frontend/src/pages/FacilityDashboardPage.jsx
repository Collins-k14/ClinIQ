import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import FacilityDashboard from '../components/facility/FacilityDashboard';
import UpgradePlans from '../components/facility/UpgradePlans';

const FacilityDashboardPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [view, setView] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Facility Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your facility listing and services</p>
            </div>
            <button
              onClick={() => navigate('/find-facilities')}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
            >
              View Public Listing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === 'upgrade' ? (
          <UpgradePlans onBack={() => setView('overview')} />
        ) : (
          <FacilityDashboard view={view} onViewChange={setView} />
        )}
      </div>
    </div>
  );
};

export default FacilityDashboardPage