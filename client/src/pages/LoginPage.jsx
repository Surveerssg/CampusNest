import {Link, Navigate, useLocation} from "react-router-dom";
import {useContext, useState, useEffect} from "react";
import axios from "axios";
import {UserContext} from "../UserContext.jsx";
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  const {setUser} = useContext(UserContext);
  const { login } = useAuth();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);

  // Pre-fill email if redirected from register
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    setError('');
    const result = await login({ email, password });
    if (result.success) {
      if (result.user?.role === 'admin') {
        setRedirectPath('/admin');
      } else if (result.user?.role === 'landlord') {
        setRedirectPath('/account/properties/new');
      } else if (result.user?.role === 'student') {
        setRedirectPath('/properties');
      } else {
        setRedirectPath('/');
      }
    } else {
      setError(result.error || 'Invalid credentials. Please try again.');
    }
  }

  async function handleGoogleLogin() {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loginData = {
        email: result.user.email,
        googleId: result.user.uid
      };
      const res = await login(loginData);
      if (res.success) {
        if (res.user?.role === 'admin') {
          setRedirectPath('/admin');
        } else if (res.user?.role === 'landlord') {
          setRedirectPath('/account/properties/new');
        } else if (res.user?.role === 'student') {
          setRedirectPath('/properties');
        } else {
          setRedirectPath('/');
        }
      } else {
        setError(res.error || 'Google sign-in failed.');
      }
    } catch (e) {
      setError('Google sign-in failed. Please try again.');
    }
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} />
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-slate-700/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-slate-600/10 rounded-full blur-2xl"></div>
      
      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Clean Professional Card */}
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 via-transparent to-slate-600/20 rounded-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl mb-4 shadow-lg border border-slate-600/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-slate-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Welcome back!
              </h1>
              <p className="text-slate-400 text-lg">Log in to your account.</p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                <div className="flex items-center text-red-300">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
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
                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300"
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
                    className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button 
                className="w-full py-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl text-slate-100 font-bold text-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-500 hover:scale-[1.02] transform transition-all duration-300 relative overflow-hidden border border-slate-600/50"
                type="submit"
              >
                <span className="relative z-10">Login</span>
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

            {/* Google Login Button */}
            <button 
              onClick={handleGoogleLogin} 
              className="w-full py-4 bg-slate-700/30 border border-slate-600/50 rounded-xl text-slate-200 font-medium text-lg hover:bg-slate-700/50 hover:border-slate-500/70 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 group-hover:scale-110 transition-transform duration-300">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>

            {/* Register Link */}
            <div className="text-center mt-8">
              <span className="text-slate-400">Don't have an account yet? </span>
              <Link 
                className="text-slate-300 hover:text-slate-100 transition-colors duration-200 font-bold hover:underline" 
                to={'/register'}
              >
                Register now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}