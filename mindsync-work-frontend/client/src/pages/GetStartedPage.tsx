import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GetStartedPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    company: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to onboarding page after successful signup
      navigate('/onboarding');
    }, 2000);
  };

  const handleGoogleSignup = () => {
    alert('Google signup integration coming soon!');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-cyan-800 flex">
      
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-8">
            <motion.button
              onClick={handleGoBack}
              className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-6"
              whileHover={{ x: -5 }}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
              </svg>
              Back to Home
            </motion.button>
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-wide mb-2">
                <span className="text-white">Mindsync</span> <span className="text-cyan-400">Work</span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Welcome to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Mindsync Work</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Get started - it's free. No credit card needed.
              </p>
            </motion.div>
          </div>

          {/* Google Signup Button */}
          <motion.button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center px-6 py-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-medium transition-all duration-300 mb-6 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img 
              src="https://dapulse-res.cloudinary.com/image/upload/remote_logos/995426/google-icon.svg" 
              alt="Google" 
              className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
            />
            Continue with Google
          </motion.button>

          {/* Divider */}
          <motion.div 
            className="flex items-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">Or</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </motion.div>

          {/* Signup Form */}
          <motion.form 
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@company.com"
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                autoComplete="email"
              />
            </div>

            {/* Full Name Input */}
            <div>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Phone Number Input */}
            <div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                autoComplete="tel"
              />
            </div>

            {/* Company Input */}
            <div>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company Name"
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create Password"
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                autoComplete="new-password"
              />
            </div>

            {/* Continue Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg disabled:cursor-not-allowed"
              whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Continue'
              )}
            </motion.button>

            {/* Terms and Privacy */}
            <motion.div 
              className="text-center text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="mb-2">By proceeding, you agree to the</p>
              <div className="flex justify-center space-x-1">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors underline">
                  Terms of Service
                </a>
                <span>and</span>
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors underline">
                  Privacy Policy
                </a>
              </div>
            </motion.div>
          </motion.form>

          {/* Login Link */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="text-gray-400">Already have an account? </span>
            <button 
              onClick={handleLogin}
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium cursor-pointer"
            >
              Log in
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <motion.div 
        className="hidden lg:flex flex-1 relative overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600"></div>
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-6">
              Transform Your Business Operations
            </h3>
            
            <p className="text-xl text-white/90 mb-8">
              Join thousands of companies already using Mindsync Work to streamline their workflows and boost productivity.
            </p>

            {/* Feature Points */}
            <div className="space-y-4 text-left">
              {[
                { icon: '✨', text: 'Enterprise-grade security and compliance' },
                { icon: '🚀', text: 'Boost team productivity by 40% on average' },
                { icon: '🎯', text: 'Customize workflows for any industry' },
                { icon: '🔗', text: 'Integrate with 100+ business tools' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-white/90">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 left-12 w-8 h-8 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Decorative Shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl"></div>
      </motion.div>
    </div>
  );
};

export default GetStartedPage;
