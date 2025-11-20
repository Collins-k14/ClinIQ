import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Menu } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import FacilityCard from '../components/facility/FacilityCard';
import FacilityDetails from '../components/facility/FacilityDetails';
import MapView from '../components/facility/MapView';
import { fetchFacilities } from '../services/facilityApi';


const FindFacilities = () => {
  const navigate = useNavigate();
  const [bookingStep, setBookingStep] = useState(1); // 1: select, 2: booking form
  const { user } = useUser();
  const [userView, setUserView] = useState('list');
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'All',
    openNow: false,
    twentyFourHour: false,
    verifiedOnly: false,
    nearbyOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFacilities();
  }, [filters]);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const data = await fetchFacilities(filters);
      setFacilities(data);
      setError(null);
    } catch (err) {
      setError('Failed to load facilities. Please try again.');
      toast.error('Failed to load facilities');
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filters.type === 'All' || facility.type === filters.type;
    const matchesVerified = !filters.verifiedOnly || facility.verified;
    const matchesNearby = !filters.nearbyOnly || facility.distance <= 5;
    const matches24Hour = !filters.twentyFourHour || facility.hours === '24/7';
    
    return matchesSearch && matchesType && matchesVerified && matchesNearby && matches24Hour;
  }).sort((a, b) => {
    if (a.premium && !b.premium) return -1;
    if (!a.premium && b.premium) return 1;
    return a.distance - b.distance;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Healthcare Facilities</h1>
          <p className="text-gray-600">Discover nearby hospitals, pharmacies, and medical specialists</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search facilities, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button
              onClick={() => setUserView(userView === 'list' ? 'map' : 'list')}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {userView === 'list' ? <MapPin className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {userView === 'list' ? 'Map' : 'List'}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Facility Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option>All</option>
                    <option>Hospital</option>
                    <option>Pharmacy</option>
                    <option>Specialist</option>
                    <option>Laboratory</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Verified Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.twentyFourHour}
                    onChange={(e) => setFilters({...filters, twentyFourHour: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">24 Hours</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.nearbyOnly}
                    onChange={(e) => setFilters({...filters, nearbyOnly: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Nearby (5km)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading facilities...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-4">
            <p className="text-gray-600">
              Found <span className="font-semibold">{filteredFacilities.length}</span> facilities
            </p>
          </div>
        )}

        {/* List or Map View */}
        {!loading && !error && (
          <>
            {userView === 'list' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredFacilities.map(facility => (
                <FacilityCard
                  key={facility._id}
                  facility={facility}
                  onClick={() => setSelectedFacility(facility)}
                  onBook={() => navigate('/appointment')}
              />

))}
              </div>
            ) : (
              <MapView 
                facilities={filteredFacilities}
                onFacilityClick={setSelectedFacility}
              />
            )}
          </>
        )}

        {/* Facility Details Modal */}
        {selectedFacility && (
          <FacilityDetails
            facility={selectedFacility}
            onClose={() => setSelectedFacility(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FindFacilities;