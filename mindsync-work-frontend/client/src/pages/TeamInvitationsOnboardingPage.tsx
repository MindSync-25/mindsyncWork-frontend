import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

const TeamInvitationsOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', email: '', role: 'member' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: 'admin', label: 'Administrator', color: 'text-red-400' },
    { value: 'manager', label: 'Project Manager', color: 'text-blue-400' },
    { value: 'team_lead', label: 'Team Lead', color: 'text-green-400' },
    { value: 'member', label: 'Team Member', color: 'text-purple-400' },
    { value: 'viewer', label: 'Viewer', color: 'text-gray-400' }
  ];

  const handleAddMember = () => {
    const newId = (teamMembers.length + 1).toString();
    setTeamMembers([...teamMembers, { id: newId, email: '', role: 'member' }]);
  };

  const handleRemoveMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
      // Clear any errors for this member
      const newErrors = { ...errors };
      delete newErrors[`email-${id}`];
      setErrors(newErrors);
    }
  };

  const handleMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
    
    // Clear error when user starts typing
    if (errors[`${field}-${id}`]) {
      setErrors(prev => ({ ...prev, [`${field}-${id}`]: '' }));
    }
  };

  const validateEmails = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usedEmails = new Set<string>();

    teamMembers.forEach(member => {
      if (member.email.trim()) {
        if (!emailRegex.test(member.email)) {
          newErrors[`email-${member.id}`] = 'Please enter a valid email address';
        } else if (usedEmails.has(member.email.toLowerCase())) {
          newErrors[`email-${member.id}`] = 'This email is already added';
        } else {
          usedEmails.add(member.email.toLowerCase());
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Filter out empty emails
    const validMembers = teamMembers.filter(member => member.email.trim());
    
    if (validMembers.length > 0 && !validateEmails()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Call API to send team invitations
      console.log('Team invitations:', validMembers);
      
      // Store in localStorage temporarily
      const existingData = JSON.parse(localStorage.getItem('userOnboardingData') || '{}');
      localStorage.setItem('userOnboardingData', JSON.stringify({
        ...existingData,
        teamInvitations: validMembers
      }));
      
      // Navigate to workspace creation
      navigate('/onboarding/workspace-creation');
    } catch (error) {
      console.error('Error sending team invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/onboarding/workspace-creation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-3xl mx-auto p-8">
        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Step 4 of 6</span>
            <span className="text-sm text-purple-400">Team Invitations</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: '50%' }}
              animate={{ width: '66.67%' }}
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
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Invite your team
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto">
            Invite team members to join your workspace. You can always add more people later from your workspace settings.
          </p>
        </motion.div>

        {/* Team Members List */}
        <motion.div 
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnimatePresence>
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  {/* Member Number */}
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>

                  {/* Email Input */}
                  <div className="flex-1">
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        errors[`email-${member.id}`] ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter team member's email"
                    />
                    {errors[`email-${member.id}`] && (
                      <p className="mt-1 text-sm text-red-400">{errors[`email-${member.id}`]}</p>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="w-48">
                    <select
                      value={member.role}
                      onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value} className="bg-gray-700">
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  {teamMembers.length > 1 && (
                    <motion.button
                      onClick={() => handleRemoveMember(member.id)}
                      className="w-10 h-10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Member Button */}
          <motion.button
            onClick={handleAddMember}
            className="w-full p-4 border-2 border-dashed border-gray-600 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add another team member
          </motion.button>
        </motion.div>

        {/* Info Box */}
        <motion.div 
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-blue-300 font-medium mb-1">How team invitations work</h3>
              <p className="text-blue-200/80 text-sm leading-relaxed">
                Team members will receive an email invitation to join your workspace. They'll be able to set up their account and access the workspace based on their assigned role.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            type="button"
            onClick={() => navigate('/onboarding/role-assignment')}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>

          <motion.button
            onClick={handleSkip}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip for now
          </motion.button>
          
          <motion.button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending invitations...
              </div>
            ) : (
              'Send invitations & Continue'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TeamInvitationsOnboardingPage;
