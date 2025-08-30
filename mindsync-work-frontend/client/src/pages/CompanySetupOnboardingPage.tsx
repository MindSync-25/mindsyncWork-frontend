import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { OrganizationService } from '../services/organizationService';
import { AuthService } from '../services/authService';

const CompanySetupOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    companyLogo: null as File | null,
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [existingCompany, setExistingCompany] = useState<any>(null);

  // Check if user already has a company
  useEffect(() => {
    const checkExistingCompany = async () => {
      try {
        const userProfile = await AuthService.getUserProfile();
        if (userProfile.company) {
          setExistingCompany(userProfile.company);
          // Pre-fill form with existing company data
          setFormData(prev => ({
            ...prev,
            companyName: userProfile.company.name || '',
            // Note: We don't have other fields from the existing company, so we'll keep them empty for now
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    checkExistingCompany();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      setFormData(prev => ({ ...prev, companyLogo: file }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
    }
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
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
    setSubmitError('');
    
    try {
      // Validate required fields before API call
      if (!formData.companyName.trim()) {
        setSubmitError('Company name is required');
        return;
      }
      if (!formData.companySize) {
        setSubmitError('Company size is required');
        return;
      }
      if (!formData.industry.trim()) {
        setSubmitError('Industry is required');
        return;
      }

      // Call API to create/update organization
      const organizationData = {
        name: formData.companyName.trim(),
        companySize: formData.companySize,
        industry: formData.industry.trim(),
        ...(formData.website.trim() && { website: formData.website.trim() }),
        ...(formData.description.trim() && { description: formData.description.trim() })
      };

      console.log('Sending organization data:', organizationData);

      let response;
      if (existingCompany?.id) {
        // Update existing organization
        console.log('Updating existing organization:', existingCompany.id);
        response = await OrganizationService.updateOrganization(existingCompany.id, organizationData);
      } else {
        // Create new organization
        console.log('Creating new organization');
        response = await OrganizationService.createOrganization(organizationData);
      }
      
      console.log('Organization operation completed successfully:', response);
      
      // Extract organization ID - both create and update return Organization object directly
      const organizationId = response?.id || existingCompany?.id || null;
      
      if (!organizationId) {
        console.warn('No organization ID returned from server:', response);
      }
      
      // Store organization ID for later use
      const existingData = JSON.parse(localStorage.getItem('userOnboardingData') || '{}');
      localStorage.setItem('userOnboardingData', JSON.stringify({
        ...existingData,
        organizationId: organizationId,
        company: {
          ...formData,
          companyLogo: formData.companyLogo?.name || null
        }
      }));

      // Upload logo if provided and we have an organization ID
      if (formData.companyLogo && organizationId) {
        try {
          await OrganizationService.uploadLogo(organizationId, formData.companyLogo);
          console.log('Company logo uploaded successfully');
        } catch (logoError) {
          console.error('Error uploading company logo:', logoError);
          // Don't stop the flow for logo upload failure
        }
      }
      
      // Navigate directly to workspace creation (skip role assignment and team invitations)
      navigate('/onboarding/workspace-creation');
    } catch (error: any) {
      console.error('Error saving company details:', error);
      console.error('Error response data:', error?.response?.data);
      
      // Extract detailed error message
      let errorMessage = 'Failed to save company details. Please try again.';
      
      if (error?.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Add validation details if available
      if (error?.response?.data?.error?.details) {
        const details = error.response.data.error.details;
        if (typeof details === 'object') {
          const fieldErrors = Object.entries(details).map(([field, msg]) => `${field}: ${msg}`).join(', ');
          errorMessage += ` (${fieldErrors})`;
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance & Banking',
    'Education',
    'Manufacturing',
    'Retail & E-commerce',
    'Marketing & Advertising',
    'Consulting',
    'Real Estate',
    'Non-profit',
    'Government',
    'Media & Entertainment',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-2xl mx-auto p-8">
        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Step 2 of 4</span>
            <span className="text-sm text-purple-400">Company Setup</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: '25%' }}
              animate={{ width: '50%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            {existingCompany ? 'Update your company details' : 'Tell us about your company'}
          </h1>
          
          <p className="text-gray-400 max-w-lg mx-auto">
            {existingCompany 
              ? 'Complete your company information to personalize your workspace.'
              : 'Help us understand your organization so we can tailor MindSync Work to your needs.'
            }
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Company Logo */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-300 mb-3">Company Logo (Optional)</label>
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors">
                {formData.companyLogo ? (
                  <img 
                    src={URL.createObjectURL(formData.companyLogo)} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.companyName ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Enter your company name"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>
            )}
          </div>

          {/* Company Size & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Size *
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.companySize ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="" className="bg-gray-800">Select company size</option>
                {companySizes.map(size => (
                  <option key={size.value} value={size.value} className="bg-gray-800">
                    {size.label}
                  </option>
                ))}
              </select>
              {errors.companySize && (
                <p className="mt-1 text-sm text-red-400">{errors.companySize}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.industry ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="" className="bg-gray-800">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry} className="bg-gray-800">
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-400">{errors.industry}</p>
              )}
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.website ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="https://www.yourcompany.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-400">{errors.website}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
              placeholder="Brief description of your company and what it does..."
            />
          </div>

          {/* Submit Error */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-red-400 text-sm">{submitError}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <motion.button
              type="button"
              onClick={() => navigate('/onboarding/user-details')}
              className="flex-1 px-6 py-3 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                'Continue'
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CompanySetupOnboardingPage;
