import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut, 
  UserButton,
  useUser 
} from '@clerk/clerk-react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HeartIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Symptom Checker', href: '/symptom-checker', icon: HeartIcon },
    { name: 'Find Facilities', href: '/find-facilities', icon: MapPinIcon },
  ];
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary-600">ClinIQ</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                {item.name}
              </Link>
            ))}
            
            {/* Signed In User */}
            <SignedIn>
              <Link
                to="/dashboard"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
              
              {/* Clerk UserButton - includes profile, settings, sign out */}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </SignedIn>
            
            {/* Signed Out - Show Auth Buttons */}
            <SignedOut>
              <Link
                to="/sign-in"
                className="px-4 py-2 text-gray-700 hover:text-primary-600"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="btn btn-primary"
              >
                Sign Up
              </Link>
            </SignedOut>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
              >
                {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                {item.name}
              </Link>
            ))}
            
            <SignedIn>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
            </SignedIn>
            
            <SignedOut>
              <Link
                to="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg"
              >
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}