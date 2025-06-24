import {Link, Navigate, useNavigate} from "react-router-dom";
import {useState, Fragment} from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const accountTypes = [
  { value: 'student', label: 'Student' },
  { value: 'landlord', label: 'Landlord' }
];

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', value: 25 };
  if (score === 2) return { label: 'Medium', color: 'bg-yellow-400', value: 50 };
  if (score === 3) return { label: 'Good', color: 'bg-blue-400', value: 75 };
  return { label: 'Strong', color: 'bg-green-500', value: 100 };
}

function getPasswordRequirements(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('pg');
  const [propertyAddress, setPropertyAddress] = useState('');
  const { register, user } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordReqs = getPasswordRequirements(password);
  const allReqsMet = Object.values(passwordReqs).every(Boolean);
  const strength = getPasswordStrength(password);

  if (user) {
    return <Navigate to={'/'} />
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setError(null);
    setLoading(true);
    const userData = {
      name,
      email,
      password,
      role,
      ...(role === 'landlord' ? {
        propertyName,
        propertyType,
        propertyAddress
      } : {})
    };
    const result = await register(userData);
    setLoading(false);
    if (result.success) {
      // Redirect to login and pre-fill email
      navigate('/login', { state: { email } });
    } else {
      setError(result.error || 'Failed to register');
    }
  }

  async function handleGoogleRegister() {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        googleId: result.user.uid,
        role,
        ...(role === 'landlord' ? {
          propertyName,
          propertyType,
          propertyAddress
        } : {})
      };
      const res = await register(userData);
      setLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error || 'Google registration failed');
      }
    } catch (e) {
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-slate-700/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-slate-600/10 rounded-full blur-2xl"></div>
      
      {/* Main Register Container */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Professional Card */}
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Border Accent */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-700/20 via-slate-600/20 to-slate-700/20"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl mb-4 shadow-lg border border-slate-600/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-slate-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Join CampusNest!
              </h1>
              <p className="text-slate-400 text-lg">Create your account to start your journey.</p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-2xl">
                <div className="flex items-center text-red-300">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
            
            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label className="block text-slate-300 mb-3 font-medium" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={ev => setName(ev.target.value)}
                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-700/30"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-slate-300 mb-3 font-medium" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-700/30"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-slate-300 mb-3 font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    className={`w-full px-4 py-4 bg-slate-700/50 border ${!allReqsMet && password ? 'border-red-400' : 'border-slate-600/50'} rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-700/30`}
                    disabled={loading}
                    required
                  />
                </div>
                {/* Password strength meter */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-300">Password strength:</span>
                      <span className={`font-semibold ${strength.label === 'Weak' ? 'text-red-400' : strength.label === 'Medium' ? 'text-yellow-400' : strength.label === 'Good' ? 'text-blue-400' : 'text-green-400'}`}>{strength.label}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded mt-1">
                      <div className={`${strength.color} h-2 rounded`} style={{ width: `${strength.value}%` }}></div>
                    </div>
                  </div>
                )}
                {/* Password requirements checklist */}
                <div className="mt-4 bg-slate-700/60 rounded-xl p-4">
                  <div className="font-semibold text-slate-200 mb-2">Password Requirements:</div>
                  <ul className="space-y-1 text-sm">
                    <li className={passwordReqs.length ? 'text-green-400' : 'text-slate-300'}>
                      <span className="mr-2">{passwordReqs.length ? '✔' : '○'}</span>At least 8 characters
                    </li>
                    <li className={passwordReqs.uppercase ? 'text-green-400' : 'text-slate-300'}>
                      <span className="mr-2">{passwordReqs.uppercase ? '✔' : '○'}</span>One uppercase letter
                    </li>
                    <li className={passwordReqs.number ? 'text-green-400' : 'text-slate-300'}>
                      <span className="mr-2">{passwordReqs.number ? '✔' : '○'}</span>One number
                    </li>
                    <li className={passwordReqs.special ? 'text-green-400' : 'text-slate-300'}>
                      <span className="mr-2">{passwordReqs.special ? '✔' : '○'}</span>One special character
                    </li>
                  </ul>
                  {!passwordReqs.length && password && (
                    <div className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <span>⚠</span> Min 8 characters
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-slate-300 mb-3 font-medium" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={ev => setConfirmPassword(ev.target.value)}
                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-700/30"
                    disabled={!allReqsMet || loading}
                    required
                  />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <div className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span>⚠</span> Passwords do not match
                  </div>
                )}
              </div>

              {/* Account Type Field */}
              <div>
                <label className="block text-slate-300 mb-3 font-medium" htmlFor="role">
                  Account Type
                </label>
                <div className="relative">
                  <select
                    id="role"
                    value={role}
                    onChange={ev => setRole(ev.target.value)}
                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 appearance-none disabled:opacity-50 disabled:bg-slate-700/30"
                    disabled={loading}
                  >
                    <option value="student" className="bg-slate-700 text-slate-100">Student</option>
                    <option value="landlord" className="bg-slate-700 text-slate-100">Landlord</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Landlord Fields */}
              {role === 'landlord' && (
                <div className="space-y-6 p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-200">Property Details</h3>
                  </div>
                  
                  {/* Property Name */}
                  <div>
                    <label className="block text-slate-300 mb-3 font-medium" htmlFor="propertyName">
                      Property Name
                    </label>
                    <div className="relative">
                      <input
                        id="propertyName"
                        type="text"
                        placeholder="Your Property Name"
                        value={propertyName}
                        onChange={ev => setPropertyName(ev.target.value)}
                        className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-700/30"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-slate-300 mb-3 font-medium" htmlFor="propertyType">
                      Property Type
                    </label>
                    <div className="relative">
                      <select
                        id="propertyType"
                        value={propertyType}
                        onChange={ev => setPropertyType(ev.target.value)}
                        className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 appearance-none disabled:opacity-50 disabled:bg-slate-700/30"
                        disabled={loading}
                      >
                        <option value="pg" className="bg-slate-700 text-slate-100">PG</option>
                        <option value="flat" className="bg-slate-700 text-slate-100">Flat</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Property Address */}
                  <div>
                    <label className="block text-slate-300 mb-3 font-medium" htmlFor="propertyAddress">
                      Property Address
                    </label>
                    <div className="relative">
                      <input
                        id="propertyAddress"
                        type="text"
                        placeholder="Your Property Address"
                        value={propertyAddress}
                        onChange={ev => setPropertyAddress(ev.target.value)}
                        className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-700/30"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Register Button */}
              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl text-slate-100 font-bold text-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-500 transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 border border-slate-600/50"
                disabled={loading}
              >
                <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800 text-slate-400">or continue with</span>
              </div>
            </div>

            {/* Google Register Button */}
            <button 
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full py-4 bg-slate-700/30 border border-slate-600/50 rounded-xl text-slate-200 font-medium text-lg hover:bg-slate-700/50 hover:border-slate-500/70 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 group-hover:scale-110 transition-transform duration-300">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Register with Google</span>
            </button>

            {/* Login Link */}
            <div className="text-center mt-8">
              <span className="text-slate-400">Already have an account? </span>
              <Link 
                className="text-slate-300 hover:text-slate-100 transition-colors duration-200 font-bold hover:underline" 
                to={'/login'}
              >
                Login now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}