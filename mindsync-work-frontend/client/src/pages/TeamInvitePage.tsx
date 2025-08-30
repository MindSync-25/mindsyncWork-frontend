import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: string;
  email: string;
  role: 'admin' | 'member';
}

const TeamInvitePage: React.FC = () => {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', email: '', role: 'member' },
    { id: '2', email: '', role: 'member' }
  ]);
  const [inviteLink] = useState(`https://mindsync.work/invite?id=mw${Date.now()}`);
  const [copySuccess, setCopySuccess] = useState(false);
  const [allowDomainSignup, setAllowDomainSignup] = useState(true);

  const handleEmailChange = (id: string, email: string) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, email } : member
      )
    );
  };

  const handleRoleChange = (id: string, role: 'admin' | 'member') => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, role } : member
      )
    );
  };

  const addTeamMember = () => {
    const newId = (teamMembers.length + 1).toString();
    setTeamMembers(prev => [...prev, { id: newId, email: '', role: 'member' }]);
  };

  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleInviteTeam = () => {
    const filledMembers = teamMembers.filter(member => member.email.trim() !== '');
    if (filledMembers.length > 0) {
      // Navigate to project setup after inviting team
      navigate('/onboarding-intro');
    }
  };

  const handleRemindLater = () => {
    navigate('/onboarding-intro');
  };

  const hasValidEmails = teamMembers.some(member => member.email.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-6">
      <motion.div 
        className="w-full max-w-2xl bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Who else is on your team?
          </h1>
          <p className="text-gray-400">
            Invite your teammates to collaborate on Mindsync Work
          </p>
        </motion.div>

        {/* Invite Link Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
            <h3 className="text-white font-semibold mb-4">Quick Invite Link</h3>
            <div className="flex gap-3">
              <div className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3">
                <input 
                  type="text" 
                  value={inviteLink}
                  readOnly
                  className="w-full bg-transparent text-gray-300 text-sm focus:outline-none"
                />
              </div>
              <motion.button
                onClick={copyInviteLink}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  copySuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {copySuccess ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Email Invitations */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-white font-semibold mb-4">Invite by Email</h3>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.id}
                className="flex gap-3 items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="flex-1">
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleEmailChange(member.id, e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
                
                <div className="relative">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value as 'admin' | 'member')}
                    className="appearance-none bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all pr-10 cursor-pointer"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {teamMembers.length > 1 && (
                  <motion.button
                    onClick={() => removeTeamMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={addTeamMember}
            className="mt-4 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            whileHover={{ x: 5 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add another teammate
          </motion.button>
        </motion.div>

        {/* Domain Signup Option */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-1">
              <input
                type="checkbox"
                checked={allowDomainSignup}
                onChange={(e) => setAllowDomainSignup(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                allowDomainSignup 
                  ? 'bg-purple-500 border-purple-500' 
                  : 'border-gray-600 bg-gray-800/50'
              }`}>
                {allowDomainSignup && (
                  <svg className="w-3 h-3 text-white absolute inset-0 m-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="text-white">
                Allow automatic signups from your company domain
              </span>
              <p className="text-sm text-gray-400 mt-1">
                Anyone with a matching company email domain can join automatically
              </p>
            </div>
          </label>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-4 justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={handleRemindLater}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip for now
          </motion.button>
          
          <motion.button
            onClick={handleInviteTeam}
            disabled={!hasValidEmails}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              hasValidEmails
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={hasValidEmails ? { scale: 1.02 } : {}}
            whileTap={hasValidEmails ? { scale: 0.98 } : {}}
          >
            Invite Team
          </motion.button>
        </motion.div>

        {/* Role Explanation */}
        <motion.div 
          className="mt-6 p-4 bg-gray-700/20 rounded-lg border border-gray-600/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h4 className="text-white font-medium mb-2">Role Permissions:</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span><strong className="text-purple-400">Admin:</strong> Full access to manage projects, invite users, and configure settings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span><strong className="text-blue-400">Member:</strong> Can collaborate on projects and access assigned work</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TeamInvitePage;
