import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/userService';

const IndividualSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    workspaceType: '',
    profilePicture: null as File | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const workspaceTypes = [
    {
      id: 'personal_projects',
      title: 'Personal Projects',
      description: 'Manage your personal side projects and hobbies',
      icon: '💡',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'freelance',
      title: 'Freelance Work',
      description: 'Track client projects and manage your freelance business',
      icon: '💼',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'learning',
      title: 'Learning & Study',
      description: 'Organize your learning goals and track progress',
      icon: '📚',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'life_organization',
      title: 'Life Organization',
      description: 'Manage tasks, goals, and daily activities',
      icon: '🎯',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleTypeSelect = (typeId: string) => {
    setFormData(prev => ({ ...prev, workspaceType: typeId }));
    if (errors.workspaceType) {
      setErrors(prev => ({ ...prev, workspaceType: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.workspaceType) {
      newErrors.workspaceType = 'Please select a workspace type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Update user profile with the collected details
      await UserService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        timezone: formData.timeZone,
        workspaceType: formData.workspaceType
      });
      
      // Upload profile picture separately if provided
      if (formData.profilePicture) {
        await UserService.uploadAvatar(formData.profilePicture);
      }
      
      console.log('Individual setup successful:', formData);
      
      // Store user type for future reference
      localStorage.setItem('userType', 'individual_user');
      
      // Navigate to full onboarding flow (since they need to set preferences)
      navigate('/onboarding-intro');
    } catch (error) {
      console.error('Error setting up individual workspace:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-3xl mx-auto p-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Set up your personal workspace
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto">
            Let's create your personal workspace. We'll customize it based on how you plan to use MindSync Work.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <motion.div 
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Personal Details</h2>
            
            {/* Profile Picture */}
            <div className="text-center mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Profile Picture (Optional)</label>
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors">
                  {formData.profilePicture ? (
                    <img 
                      src={URL.createObjectURL(formData.profilePicture)} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact & Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Your phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Zone
                </label>
                <select
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <option value="America/New_York">Eastern Time (EST/EDT)</option>
                  <option value="America/Chicago">Central Time (CST/CDT)</option>
                  <option value="America/Denver">Mountain Time (MST/MDT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Paris (CET/CEST)</option>
                  <option value="Europe/Berlin">Berlin (CET/CEST)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Shanghai">Shanghai (CST)</option>
                  <option value="Asia/Kolkata">Mumbai (IST)</option>
                  <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Workspace Type Selection */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">What will you use this workspace for?</h2>
            {errors.workspaceType && (
              <p className="mb-4 text-sm text-red-400">{errors.workspaceType}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workspaceTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative p-6 bg-gray-800/50 border rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.workspaceType === type.id
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => handleTypeSelect(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Selection Indicator */}
                  {formData.workspaceType === type.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}

                  {/* Type Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{type.icon}</span>
                  </div>

                  {/* Type Info */}
                  <h3 className="text-lg font-semibold text-white mb-2">{type.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{type.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => navigate('/onboarding/user-type')}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting up workspace...
                </div>
              ) : (
                'Continue to Workspace Setup'
              )}
            </motion.button>
          </div>
        </form>

        {/* Info */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-400 text-sm">
            Next, we'll help you customize your workspace with the right templates and features for your needs.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default IndividualSetupPage;
