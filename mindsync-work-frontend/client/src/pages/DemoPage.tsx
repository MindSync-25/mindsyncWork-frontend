import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DemoPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    industry: '',
    teamSize: '',
    useCase: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Demo booking submitted:', formData);
    alert('Thank you! We\'ll contact you soon to schedule your personalized demo.');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 shadow-md border-b border-gray-700/50">
        <motion.button
          onClick={handleGoBack}
          className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
          whileHover={{ x: -5 }}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
          </svg>
          Back to Home
        </motion.button>
        
        <h1 className="text-2xl font-bold tracking-wide">
          Mindsync <span className="text-purple-400">Work</span>
        </h1>
        
        <div className="w-24"></div> {/* Spacer for centering */}
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side - Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-6">
              🎯 Personalized Demo
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              See Mindsync Work in Action
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Get a personalized demo tailored to your industry and business needs. 
              Our experts will show you exactly how Mindsync Work can transform your operations.
            </p>

            {/* What You'll See */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">What You'll Experience:</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: '🎯',
                    title: 'Industry-Specific Walkthrough',
                    desc: 'See workflows and features customized for your specific industry'
                  },
                  {
                    icon: '👥',
                    title: 'Role-Based Access Demo',
                    desc: 'Experience our 4-tier RBAC system from different user perspectives'
                  },
                  {
                    icon: '📊',
                    title: 'Live Data Integration',
                    desc: 'Watch real-time analytics and reporting capabilities in action'
                  },
                  {
                    icon: '🔧',
                    title: 'Custom Configuration',
                    desc: 'Learn how to set up workflows that match your current processes'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">30 min</div>
                <div className="text-gray-400 text-sm">Demo Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">1-on-1</div>
                <div className="text-gray-400 text-sm">Personal Expert</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">Free</div>
                <div className="text-gray-400 text-sm">No Commitment</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Demo Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
            
            <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Book Your Demo</h3>
                <p className="text-gray-400">Let's schedule a time that works for you</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                {/* Company Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Business Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Industry *
                    </label>
                    <select
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      <option value="">Select Industry</option>
                      <option value="construction">Construction & Engineering</option>
                      <option value="healthcare">Healthcare & Life Sciences</option>
                      <option value="finance">Finance & Banking</option>
                      <option value="marketing">Marketing & Advertising</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail & E-commerce</option>
                      <option value="technology">Technology & Software</option>
                      <option value="legal">Legal & Compliance</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="startup">Startup</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Size *
                    </label>
                    <select
                      name="teamSize"
                      required
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      <option value="">Select Team Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-1000">201-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>

                {/* Use Case */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Primary Use Case *
                  </label>
                  <select
                    name="useCase"
                    required
                    value={formData.useCase}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  >
                    <option value="">What's your main goal?</option>
                    <option value="project-management">Project Management</option>
                    <option value="team-collaboration">Team Collaboration</option>
                    <option value="content-production">Content Production</option>
                    <option value="crm-sales">CRM & Sales</option>
                    <option value="compliance-tracking">Compliance Tracking</option>
                    <option value="resource-planning">Resource Planning</option>
                    <option value="client-management">Client Management</option>
                    <option value="workflow-automation">Workflow Automation</option>
                    <option value="replace-current-tool">Replace Current Tool</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Scheduling */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Time
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      <option value="">Select Time Preference</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                      <option value="evening">Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    placeholder="Tell us about your specific needs, current challenges, or questions you'd like addressed during the demo..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-red-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg"
                >
                  Book My Demo
                </motion.button>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-400 pt-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    No commitment
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    30-min session
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Expert guidance
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-700 bg-gray-900 mt-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              © 2025 Mindsync Work. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoPage;
