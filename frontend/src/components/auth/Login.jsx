// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
// import { useAuth } from '../../context/AuthContext';
// import Input from '../common/Input';
// import Button from '../common/Button';
// import Alert from '../common/Alert';

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();
  
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     try {
//       await login(formData.email, formData.password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to login. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full">
//         <div className="card">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
//             <p className="text-gray-600 mt-2">Sign in to your ClinIQ account</p>
//           </div>
          
//           {/* Error Alert */}
//           {error && (
//             <Alert 
//               type="error" 
//               message={error} 
//               onClose={() => setError('')}
//             />
//           )}
          
//           {/* Login Form */}
//           <form onSubmit={handleSubmit}>
//             <Input
//               label="Email Address"
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="john@example.com"
//               icon={EnvelopeIcon}
//               required
//             />
            
//             <Input
//               label="Password"
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//               icon={LockClosedIcon}
//               required
//             />
            
//             <Input
//               label="Confirm Password"
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="••••••••"
//               icon={LockClosedIcon}
//               required
//             />
            
//             <div className="mb-6">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   required
//                 />
//                 <span className="ml-2 text-sm text-gray-600">
//                   I agree to the{' '}
//                   <Link to="/terms" className="text-primary-600 hover:text-primary-700">
//                     Terms of Service
//                   </Link>{' '}
//                   and{' '}
//                   <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
//                     Privacy Policy
//                   </Link>
//                 </span>
//               </label>
//             </div>
            
//             <Button
//               type="submit"
//               variant="primary"
//               fullWidth
//               disabled={loading}
//             >
//               {loading ? 'Creating Account...' : 'Create Account'}
//             </Button>
//           </form>
          
//           {/* Sign In Link */}
//           <p className="mt-6 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
