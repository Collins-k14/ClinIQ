import React from 'react';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { upgradeFacilityPlan } from '../../services/facilityApi';

const UpgradePlans = ({ onBack, currentPlan = 'basic' }) => {
  const plans = [
    {
      id: 'basic',
      name: "Basic",
      price: "Free",
      features: [
        "Basic profile listing",
        "Limited visibility",
        "Up to 3 services",
        "Standard support"
      ]
    },
    {
      id: 'premium',
      name: "Premium",
      price: "KES 5,000/month",
      features: [
        "Verified badge",
        "Top search placement",
        "Unlimited services",
        "Price listing",
        "Analytics dashboard",
        "Priority support",
        "Photo gallery"
      ],
      popular: true
    },
    {
      id: 'featured',
      name: "Featured",
      price: "KES 10,000/month",
      features: [
        "Everything in Premium",
        "Featured placement",
        "Promotional offers",
        "Dedicated account manager",
        "Advanced analytics",
        "Social media promotion"
      ]
    }
  ];

  const handleUpgrade = async (planId) => {
    try {
      const result = await upgradeFacilityPlan(planId);
      toast.success(`Successfully upgraded to ${planId}!`);
      // Redirect to payment or refresh dashboard
      setTimeout(() => onBack(), 2000);
    } catch (err) {
      console.error('Upgrade error:', err);
      toast.error('Failed to process upgrade. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Upgrade Your Listing</h2>
        <p className="text-gray-600">Choose the plan that works best for your facility</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg p-6 ${
              plan.popular ? 'ring-2 ring-blue-600 relative' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-1">{plan.price}</div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                plan.id === currentPlan
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
              disabled={plan.id === currentPlan}
            >
              {plan.id === currentPlan ? 'Current Plan' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UpgradePlans;