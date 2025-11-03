import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
// import { symptomService } from '../services/symptomService';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [stats, setStats] = useState({
    totalChecks: 0,
    upcomingAppointments: 0,
    savedFacilities: 3
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch symptom history (will work if user is logged in)
      try {
        const history = await symptomService.getSymptomHistory();
        setSymptomHistory(history.history || []);
        setStats(prev => ({
          ...prev,
          totalChecks: history.total || 0
        }));
      } catch (error) {
        // User not logged in or no history - that's okay
        console.log('No symptom history available');
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your health overview.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={HeartIcon}
            title="Symptom Checks"
            value={stats.totalChecks}
            color="blue"
            subtitle="Total assessments"
          />
          <StatsCard
            icon={CalendarIcon}
            title="Appointments"
            value={stats.upcomingAppointments}
            color="green"
            subtitle="Upcoming"
          />
          <StatsCard
            icon={MapPinIcon}
            title="Saved Facilities"
            value={stats.savedFacilities}
            color="purple"
            subtitle="Favorites"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              to="/symptom-checker"
              icon={HeartIcon}
              title="Check Symptoms"
              description="Start a new symptom assessment"
              color="blue"
            />
            <QuickActionCard
              to="/find-facilities"
              icon={MapPinIcon}
              title="Find Facilities"
              description="Search nearby healthcare providers"
              color="green"
            />
            <QuickActionCard
              to="/appointments"
              icon={CalendarIcon}
              title="Book Appointment"
              description="Schedule with a provider"
              color="purple"
            />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Symptom Checks */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Symptom Checks
                </h2>
                <Link
                  to="/symptom-checker"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  New Check
                </Link>
              </div>

              {symptomHistory.length > 0 ? (
                <div className="space-y-4">
                  {symptomHistory.slice(0, 5).map((check) => (
                    <SymptomCheckItem key={check._id} check={check} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={HeartIcon}
                  title="No symptom checks yet"
                  description="Start your first health assessment"
                  actionText="Check Symptoms"
                  actionLink="/symptom-checker"
                />
              )}
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Appointments
                </h2>
                <Link
                  to="/appointments"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All
                </Link>
              </div>

              <EmptyState
                icon={CalendarIcon}
                title="No upcoming appointments"
                description="Book your first appointment with a healthcare provider"
                actionText="Book Appointment"
                actionLink="/appointments"
              />
            </Card>
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-6">
            {/* Health Tips */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Health Tips
              </h3>
              <div className="space-y-4">
                <HealthTip
                  icon="💧"
                  title="Stay Hydrated"
                  description="Drink at least 8 glasses of water daily"
                />
                <HealthTip
                  icon="🏃"
                  title="Daily Exercise"
                  description="30 minutes of activity keeps you healthy"
                />
                <HealthTip
                  icon="😴"
                  title="Quality Sleep"
                  description="Aim for 7-9 hours of sleep each night"
                />
                <HealthTip
                  icon="🥗"
                  title="Balanced Diet"
                  description="Eat a variety of fruits and vegetables"
                />
              </div>
            </Card>

            {/* Emergency Contacts */}
            <Card className="bg-red-50 border border-red-200">
              <div className="flex items-center space-x-2 mb-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-900">
                  Emergency
                </h3>
              </div>
              <p className="text-sm text-red-800 mb-3">
                In case of medical emergency, call:
              </p>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600">Emergency Services</p>
                  <p className="text-xl font-bold text-red-600">999 / 911 / 112</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600">Ambulance</p>
                  <p className="text-lg font-bold text-red-600">+254 700 000 000</p>
                </div>
              </div>
            </Card>

            {/* Profile Completion */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Profile
                </h3>
                <Badge variant="warning" size="sm">60%</Badge>
              </div>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Complete your profile to get personalized health recommendations
              </p>
              <Link to="/profile">
                <Button variant="outline" size="sm" fullWidth>
                  Complete Profile
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ icon: Icon, title, value, color, subtitle }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
}

// Quick Action Card Component
function QuickActionCard({ to, icon: Icon, title, description, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
  };

  return (
    <Link to={to} className="group">
      <Card hover className="h-full">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg transition-colors ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="mt-3 flex items-center text-primary-600 text-sm font-medium">
              <span>Get started</span>
              <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Symptom Check Item Component
function SymptomCheckItem({ check }) {
  const getSeverityColor = (severity) => {
    const colors = {
      emergency: 'danger',
      severe: 'warning',
      moderate: 'warning',
      mild: 'success'
    };
    return colors[severity] || 'default';
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now - d) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
      <div className="flex items-start space-x-4 flex-1">
        <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
          <HeartIcon className="h-5 w-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {check.symptoms.slice(0, 3).join(', ')}
              {check.symptoms.length > 3 && ` +${check.symptoms.length - 3} more`}
            </p>
            <Badge variant={getSeverityColor(check.triageResult.severity)} size="sm">
              {check.triageResult.severity}
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            {formatDate(check.createdAt)}
          </p>
        </div>
      </div>
      <Link 
        to={`/symptoms/${check._id}`}
        className="text-primary-600 hover:text-primary-700 ml-4"
      >
        <ArrowRightIcon className="h-5 w-5" />
      </Link>
    </div>
  );
}

// Health Tip Component
function HealthTip({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ icon: Icon, title, description, actionText, actionLink }) {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link to={actionLink}>
        <Button variant="primary">{actionText}</Button>
      </Link>
    </div>
  );
}