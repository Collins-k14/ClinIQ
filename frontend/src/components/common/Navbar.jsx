import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MapPinIcon } from '@heroicons/react/24/outline';

const NavLink = ({ children, to }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 text-gray-700 hover:text-[rgb(var(--primary-600))] transition-colors"
  >
    {children}
  </Link>
);

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-[rgb(var(--primary-600))]">
              ClinIQ
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <NavLink to="/symptom-checker">
              <HeartIcon className="icon-base" aria-hidden="true" />
              <span>Symptom Checker</span>
            </NavLink>
            <NavLink to="/find-facilities">
              <MapPinIcon className="icon-base" aria-hidden="true" />
              <span>Find Facilities</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

