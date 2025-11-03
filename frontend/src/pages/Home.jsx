
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleBottomCenterTextIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      icon: ChatBubbleBottomCenterTextIcon,
      title: 'Symptom Checker',
      description: 'Get instant AI-powered assessment of your symptoms and receive personalized healthcare recommendations.',
      link: '/symptom-checker',
      color: 'bg-blue-500'
    },
    {
      icon: MapPinIcon,
      title: 'Find Facilities',
      description: 'Locate nearby hospitals, clinics, specialists, and pharmacies with real-time availability and directions.',
      link: '/find-facilities',
      color: 'bg-green-500'
    },
    {
      icon: CalendarDaysIcon,
      title: 'Book Appointments',
      description: 'Schedule appointments with healthcare providers at your convenience with instant confirmations.',
      link: '/dashboard',
      color: 'bg-purple-500'
    }
  ];
  
  const benefits = [
    {
      icon: ClockIcon,
      title: '24/7 Availability',
      description: 'Access healthcare information and book appointments anytime, anywhere.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Verified Facilities',
      description: 'All healthcare facilities are verified and regularly updated for your safety.'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Care',
      description: 'Connect with qualified healthcare professionals and specialists.'
    }
  ];
  
  const stats = [
    { value: '500+', label: 'Healthcare Facilities' },
    { value: '10K+', label: 'Happy Patients' },
    { value: '50+', label: 'Specialties' },
    { value: '4.9', label: 'Average Rating' }
  ];
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Your Health, Simplified
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8">
                Check symptoms, find facilities, and book appointments - all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/symptom-checker" className="btn bg-white text-primary-600 hover:bg-gray-100 text-center text-lg px-8 py-3">
                  Check Symptoms
                </Link>
                <Link to="/find-facilities" className="btn bg-primary-700 text-white hover:bg-primary-800 text-center text-lg px-8 py-3">
                  Find Facilities
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-3xl opacity-10 transform rotate-6"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop" 
                    alt="Healthcare" 
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-gray-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ClinIQ provides comprehensive healthcare services at your fingertips
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="card hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <span className="text-primary-600 font-medium group-hover:underline">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ClinIQ?
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of patients across Kenya
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who trust ClinIQ for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
              Get Started Free
            </Link>
            <Link to="/symptom-checker" className="btn bg-primary-700 text-white hover:bg-primary-800 text-lg px-8 py-3">
              Try Symptom Checker
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Mwangi',
                role: 'Patient',
                comment: 'ClinIQ helped me find a specialist near me within minutes. The symptom checker gave me peace of mind before my appointment.',
                rating: 5
              },
              {
                name: 'Dr. James Ochieng',
                role: 'Healthcare Provider',
                comment: 'As a facility manager, ClinIQ has streamlined our appointment booking process. Our patients love the convenience.',
                rating: 5
              },
              {
                name: 'Mary Wanjiku',
                role: 'Patient',
                comment: 'The platform is so easy to use! I booked my appointment in less than 2 minutes. Highly recommended!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}