import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dashboard or password step
      console.log('Email submitted:', email);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    // Handle Google OAuth
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/get-started');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={handleBackToHome}
            className="flex items-center text-gray-400 hover:text-purple-400 transition-colors mb-6 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
            </svg>
            Back to home
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Log in to your account</h1>
          <div className="flex items-center text-gray-400 text-sm">
            <span className="mr-2">Welcome to</span>
            <span className="font-semibold text-purple-400">Mindsync Work</span>
          </div>
        </motion.div>

        {/* Main login form */}
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Email input section */}
          <div className="mb-6">
            <label htmlFor="user_email" className="block text-gray-300 text-sm font-medium mb-3">
              Enter your work email address
            </label>
            <div className="relative">
              <input
                id="user_email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="Example@company.com"
                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  emailError 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-gray-600 focus:border-purple-500 focus:ring-purple-500/50'
                }`}
                aria-label="Enter your work email address"
                aria-describedby="user_email_error"
                aria-invalid={!!emailError}
              />
              {emailError && (
                <motion.div 
                  className="mt-2 text-red-400 text-sm"
                  id="user_email_error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {emailError}
                </motion.div>
              )}
            </div>
          </div>

          {/* Next button */}
          <motion.button
            type="button"
            onClick={handleEmailSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group disabled:cursor-not-allowed"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            aria-disabled={isLoading}
            aria-busy={isLoading}
            aria-label="Next"
          >
            <div className="flex items-center">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Next
                  <svg 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    width="20" 
                    height="20" 
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  >
                    <path 
                      d="M2.24999 10.071C2.24999 9.65683 2.58578 9.32104 2.99999 9.32104L15.3315 9.32105L10.7031 4.69273C10.4103 4.39983 10.4103 3.92496 10.7031 3.63207C10.996 3.33917 11.4709 3.33917 11.7638 3.63207L17.6725 9.54071C17.9653 9.83361 17.9653 10.3085 17.6725 10.6014L11.7638 16.51C11.4709 16.8029 10.996 16.8029 10.7031 16.51C10.4103 16.2171 10.4103 15.7423 10.7031 15.4494L15.3315 10.821L2.99999 10.821C2.58578 10.821 2.24999 10.4853 2.24999 10.071Z" 
                      fillRule="evenodd" 
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </div>
          </motion.button>

          {/* Separator */}
          <div className="my-8">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <h2 className="px-4 text-gray-400 text-sm">Or Sign in with</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>
          </div>

          {/* Google login button */}
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 hover:border-gray-500 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Login with Google"
          >
            <img 
              src="https://cdn.monday.com/images/logo_google_v2.svg" 
              alt="" 
              className="w-5 h-5 mr-3"
              aria-hidden="true"
            />
            <span>Google</span>
          </motion.button>

          {/* Footer links */}
          <div className="mt-8 space-y-4 text-center">
            {/* Sign up suggestion */}
            <div className="text-gray-400 text-sm">
              <span>Don't have an account yet? </span>
              <button
                onClick={handleSignUp}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign up
              </button>
            </div>

            {/* Support link */}
            <div className="text-gray-500 text-sm">
              <span>Can't log in? </span>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                Visit our help center
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom branding */}
        <motion.div 
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            <span>Trusted by thousands of teams worldwide</span>
          </div>
          <div className="text-xs text-gray-600">
            Secure • Reliable • Enterprise-ready
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
