import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/clerk-react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeModernIcon,
  MapPinIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Calendar } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeModernIcon },
    { name: 'Symptom Checker', href: '/symptom-checker', icon: ClipboardDocumentCheckIcon },
    { name: 'Find Facilities', href: '/find-facilities', icon: MapPinIcon },
    { name: 'Book Appointment', href: '/appointments', icon: CalendarIcon },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg'
        : 'bg-white/90 backdrop-blur-md shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group">
              <span className="text-3xl font-bold text-primary-600 hover:text-primary-700 transition-all duration-300 inline-block hover:scale-105">
                ClinIQ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 group overflow-hidden ${
                  isActive(item.href)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {item.icon && (
                  <item.icon className={`h-5 w-5 mr-2 transition-all duration-300 ${
                    isActive(item.href) ? 'text-primary-600' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                  }`} />
                )}
                <span>{item.name}</span>
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-t-full"></span>
                )}
              </Link>
            ))}

            {/* Dashboard when signed in */}
            <SignedIn>
              <Link
                to="/dashboard"
                className={`relative flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 group ${
                  isActive('/dashboard')
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                <ChartBarIcon className={`h-5 w-5 mr-2 transition-all duration-300 ${
                  isActive('/dashboard') ? 'text-primary-600' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                }`} />
                Dashboard
                {isActive('/dashboard') && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-t-full"></span>
                )}
              </Link>

              <div className="ml-2 transform hover:scale-110 transition-transform duration-300">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-11 h-11 ring-2 ring-primary-200 hover:ring-primary-400 transition-all duration-300",
                      userButtonPopoverCard: "shadow-xl"
                    }
                  }}
                />
              </div>
            </SignedIn>

            {/* Signed Out */}
            <SignedOut>
              <Link
                to="/sign-in"
                className="px-5 py-2.5 text-gray-700 hover:text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-all duration-300"
              >
                Sign In
              </Link>
              {/* Updated Sign Up button */}
              <Link
                to="/sign-up"
                className="px-5 py-2.5 text-gray-700 hover:text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-all duration-300"
              >
                Sign Up
              </Link>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <SignedIn>
              <div className="mr-2 transform hover:scale-110 transition-transform duration-300">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-primary-200 hover:ring-primary-400 transition-all duration-300",
                      userButtonPopoverCard: "shadow-xl"
                    }
                  }}
                />
              </div>
            </SignedIn>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative p-2 text-gray-700 hover:text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-300"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <Bars3Icon className="h-6 w-6" />
                </span>
                <span className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
                  <XMarkIcon className="h-6 w-6" />
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border-t border-gray-100 px-4 py-6 space-y-2 shadow-inner">

          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group ${
                isActive(item.href)
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <item.icon className={`h-6 w-6 mr-3 ${
                isActive(item.href) ? 'text-primary-600' : 'text-gray-500 group-hover:text-blue-600'
              }`} />
              {item.name}
            </Link>
          ))}

          <SignedIn>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group ${
                isActive('/dashboard')
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <ChartBarIcon className="h-6 w-6 mr-3 text-gray-500 group-hover:text-blue-600" />
              Dashboard
            </Link>
          </SignedIn>

          <SignedOut>
            <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
              <Link
                to="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3.5 text-gray-700 text-center font-medium hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
              >
                Sign In
              </Link>
              {/* Updated mobile Sign Up button */}
              <Link
                to="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3.5 text-gray-700 text-center font-medium hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>

        </div>
      </div>
    </nav>
  );
}
