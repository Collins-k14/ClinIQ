import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Star, Award, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { fetchFacilityProfile, updateFacilityProfile } from '../../services/facilityApi';

const FacilityDashboard = ({ view, onViewChange }) => {
  const { user } = useUser();
  const [facilityProfile, setFacilityProfile] = useState({
    name: "",
    type: "Hospital",
    isPremium: false,
    services: [],
    hours: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchFacilityProfile();
      setFacilityProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateFacilityProfile(facilityProfile);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: "Profile Views", value: "1,234", change: "+12%", icon: TrendingUp },
    { label: "Bookings", value: "45", change: "+8%", icon: Calendar },
    { label: "Rating", value: "4.5", change: "+0.3", icon: Star }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{facilityProfile.name || "My Facility"}</h2>
            <p className="text-gray-600">{facilityProfile.type}</p>
          </div>
          <div className="flex items-center gap-2">
            {!facilityProfile.isPremium && (
              <button
                onClick={() => onViewChange('upgrade')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto">
          {['overview', 'profile', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => onViewChange(tab)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                view === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {view === 'overview' && (
          <div>
            {!facilityProfile.isPremium && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Upgrade to Premium to appear in search results
                    </h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      Get verified badge, top placement, unlimited services, and access to analytics.
                    </p>
                    <button
                      onClick={() => onViewChange('upgrade')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
                    >
                      View Premium Plans
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <stat.icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">New booking from John Doe</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Profile viewed 45 times</span>
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">New review received</span>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'profile' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facility Name</label>
              <input
                type="text"
                value={facilityProfile.name}
                onChange={(e) => setFacilityProfile({...facilityProfile, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={facilityProfile.type}
                onChange={(e) => setFacilityProfile({...facilityProfile, type: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Hospital</option>
                <option>Pharmacy</option>
                <option>Specialist</option>
                <option>Laboratory</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                value={facilityProfile.address}
                onChange={(e) => setFacilityProfile({...facilityProfile, address: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={facilityProfile.phone}
                onChange={(e) => setFacilityProfile({...facilityProfile, phone: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+254 700 000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Working Hours</label>
              <input
                type="text"
                value={facilityProfile.hours}
                onChange={(e) => setFacilityProfile({...facilityProfile, hours: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 9:00 AM - 6:00 PM or 24/7"
              />
            </div>
            <button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {view === 'analytics' && (
          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Traffic Overview</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Analytics chart would appear here</p>
                  <p className="text-sm text-gray-400 mt-2">Connect to your analytics service</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Top Services</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>General Consultation</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Care</span>
                    <span className="font-medium">30%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Peak Hours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>9:00 AM - 12:00 PM</span>
                    <span className="font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2:00 PM - 5:00 PM</span>
                    <span className="font-medium">Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityDashboard;
