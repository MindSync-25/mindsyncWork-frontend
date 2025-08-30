import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/account-type');
  };

  const handleScheduleDemo = () => {
    navigate('/demo');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-white">Mindsync</span> <span className="text-purple-400">Work</span>
        </h1>
        <nav className="hidden md:flex gap-6 text-gray-300">
          <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
          <a href="#services" className="hover:text-purple-400 transition-colors">Services</a>
          <a href="#solutions" className="hover:text-purple-400 transition-colors">Industries</a>
          <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
          <a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="text-gray-300 hover:text-purple-400 transition-colors font-medium"
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-purple-500 hover:bg-purple-600 rounded-xl px-6 py-2 font-medium transition-all duration-200 shadow-lg"
          >
            Get Started
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="flex flex-col items-center justify-center flex-grow text-center px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h2 
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-clip-text text-transparent mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Your Complete Business Operations Platform
        </motion.h2>
        <motion.p 
          className="text-lg max-w-3xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          From marketing campaigns to software development, manufacturing to education - 
          Mindsync Work powers your entire business with comprehensive project management, 
          content production, CRM, forms, docs, and enterprise-grade security across all industries.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(168, 85, 247, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-red-500 text-lg px-8 py-4 rounded-xl shadow-lg font-medium transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Start Your Business Transformation
        </motion.button>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Enterprise-Grade Platform
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything your business needs in one powerful, secure, and scalable platform
            </p>
          </motion.div>

          {/* Main Feature Showcase */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                � Enterprise Security
              </div>
              <h4 className="text-3xl font-bold text-white mb-4">
                Advanced Role-Based Access Control
              </h4>
              <p className="text-gray-300 text-lg mb-6">
                4-tier permission system designed for enterprise compliance. Team Members, Team Leads, 
                Managers, and Clients each get exactly the right level of access with granular controls 
                and audit trails.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Granular permission management
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  SOC 2 Type II compliance ready
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Complete audit trail and logging
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/30">
                <div className="bg-gray-800/60 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-300 font-semibold">Access Control Dashboard</span>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300">👑 Manager</span>
                      <span className="text-purple-300 text-sm">Full Access</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300">👨‍💼 Team Lead</span>
                      <span className="text-blue-300 text-sm">Team Management</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300">👤 Team Member</span>
                      <span className="text-green-300 text-sm">Task Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">�</div>
                <h5 className="text-xl font-semibold text-white mb-3">Real-Time Analytics</h5>
                <p className="text-gray-400">
                  Live dashboards with performance insights, team productivity metrics, and project health indicators.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">�</div>
                <h5 className="text-xl font-semibold text-white mb-3">Multiple Views</h5>
                <p className="text-gray-400">
                  Kanban boards, Gantt charts, calendar views, table lists, and workload management - your choice.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="h-full p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">🔗</div>
                <h5 className="text-xl font-semibold text-white mb-3">Smart Integrations</h5>
                <p className="text-gray-400">
                  Connect with Slack, Google Workspace, Jira, Salesforce, and 100+ business tools seamlessly.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-8 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              One Platform, Endless Possibilities
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              From marketing campaigns to software development, we've got every aspect of your business covered
            </p>
          </motion.div>

          {/* Main Services Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                  📱
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Marketing & Content</h4>
                  <p className="text-gray-400">Campaign management, content production workflows, social media scheduling, and performance analytics all in one place.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Project Management</h4>
                  <p className="text-gray-400">End-to-end project control with Gantt charts, resource allocation, budget tracking, and milestone management.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                  💼
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Sales & CRM</h4>
                  <p className="text-gray-400">Customer relationship management, sales pipeline tracking, automated workflows, and revenue forecasting.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                  ⚙️
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Software Development</h4>
                  <p className="text-gray-400">Agile development workflows, sprint planning, code reviews, DevOps pipelines, and product roadmaps.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                  👥
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">HR & Operations</h4>
                  <p className="text-gray-400">Team management, onboarding processes, performance tracking, and business process optimization.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-2xl">
                  🎨
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Design & Creative</h4>
                  <p className="text-gray-400">Creative project workflows, design approvals, asset management, and brand consistency tools.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Services - Modern Grid Layout */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-white mb-2">Plus Many More Specialized Tools</h4>
                <p className="text-gray-400">Everything you need to run your business efficiently</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { icon: '📄', title: 'Docs & Forms', color: 'text-blue-400', bg: 'hover:bg-blue-500/10' },
                  { icon: '👨‍💻', title: 'Freelancers', color: 'text-green-400', bg: 'hover:bg-green-500/10' },
                  { icon: '🏭', title: 'Manufacturing', color: 'text-yellow-400', bg: 'hover:bg-yellow-500/10' },
                  { icon: '🚀', title: 'Startup Tools', color: 'text-purple-400', bg: 'hover:bg-purple-500/10' },
                  { icon: '🎓', title: 'Education', color: 'text-indigo-400', bg: 'hover:bg-indigo-500/10' },
                  { icon: '🏢', title: 'Real Estate', color: 'text-emerald-400', bg: 'hover:bg-emerald-500/10' },
                  { icon: '💡', title: 'Expert Solutions', color: 'text-amber-400', bg: 'hover:bg-amber-500/10' }
                ].map((service, index) => (
                  <motion.div
                    key={service.title}
                    className={`group relative p-4 rounded-xl bg-gray-700/30 ${service.bg} border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 text-center`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <div className={`text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 ${service.color}`}>
                      {service.icon}
                    </div>
                    <div className="text-xs md:text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {service.title}
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-600/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </div>
              
              {/* Bottom CTA */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-400 text-sm mb-4">
                  And 50+ more industry-specific features designed by experts
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400/50 rounded-xl text-purple-300 hover:text-purple-200 text-sm font-medium transition-all duration-300"
                >
                  Explore All Features →
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Trusted Across Industries
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From startups to Fortune 500 companies, businesses worldwide rely on Mindsync Work
            </p>
          </motion.div>

          {/* Industry Showcase - Large Format */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <motion.div 
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">🏗️</div>
              <div className="text-5xl mb-4">🏗️</div>
              <h4 className="text-2xl font-bold text-white mb-3">Construction & Engineering</h4>
              <p className="text-gray-300 mb-4">
                Manage complex engineering plans, safety certifications, compliance tracking, and multi-site coordination with specialized workflows designed for construction teams.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Safety Management</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Project Planning</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Compliance</span>
              </div>
            </motion.div>

            <motion.div 
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-500"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">🏥</div>
              <div className="text-5xl mb-4">🏥</div>
              <h4 className="text-2xl font-bold text-white mb-3">Healthcare & Life Sciences</h4>
              <p className="text-gray-300 mb-4">
                Streamline compliance tracking, system implementations, staff scheduling, and patient care coordination with HIPAA-compliant workflows.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">HIPAA Compliance</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Staff Scheduling</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Patient Care</span>
              </div>
            </motion.div>
          </div>

          {/* Secondary Industries Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💰', title: 'Finance', desc: 'Risk assessments, regulatory reporting, audit preparation' },
              { icon: '📱', title: 'Marketing', desc: 'Campaign strategies, creative workflows, performance analytics' },
              { icon: '🎓', title: 'Education', desc: 'Academic planning, student projects, resource allocation' },
              { icon: '🛒', title: 'Retail', desc: 'Store operations, supply chain management, promotions' },
              { icon: '🖥️', title: 'Technology', desc: 'Agile workflows, product roadmaps, development sprints' },
              { icon: '⚖️', title: 'Legal', desc: 'Case tracking, contract management, compliance deadlines' },
              { icon: '🏢', title: 'Real Estate', desc: 'Property management, client relations, transaction tracking' },
              { icon: '�', title: 'Startups', desc: 'Product launches, fundraising, growth metrics' }
            ].map((solution, index) => (
              <motion.div
                key={solution.title}
                className="p-6 rounded-xl bg-gray-800/60 backdrop-blur-sm hover:bg-gray-700/60 transition-all duration-300 border border-gray-600/50 hover:border-purple-500/50 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{solution.icon}</div>
                <h4 className="text-lg font-semibold mb-2 text-white">{solution.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{solution.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-8 bg-gradient-to-r from-gray-900 via-purple-900/10 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                🚀 Enterprise Ready
              </div>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mindsync Work?</span>
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Built with enterprise security and scalability in mind, Mindsync Work balances 
                powerful features with intuitive design. Our comprehensive platform serves 
                businesses across all industries with advanced role-based access control.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span>SOC 2 Type II compliant with enterprise-grade security</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span>Scales from startups to Fortune 500 companies</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span>99.9% uptime with global infrastructure</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  99.9%
                </motion.div>
                <div className="text-gray-400 font-medium">Uptime SLA</div>
                <div className="text-gray-500 text-sm mt-1">Enterprise reliability</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  500+
                </motion.div>
                <div className="text-gray-400 font-medium">Companies</div>
                <div className="text-gray-500 text-sm mt-1">Trust our platform</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-5xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  24/7
                </motion.div>
                <div className="text-gray-400 font-medium">Support</div>
                <div className="text-gray-500 text-sm mt-1">Always available</div>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-5xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  100+
                </motion.div>
                <div className="text-gray-400 font-medium">Integrations</div>
                <div className="text-gray-500 text-sm mt-1">Connect everything</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-8 bg-gradient-to-br from-gray-800 via-purple-900/20 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm font-medium mb-6">
              🚀 Get Started Today
            </div>
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Ready to Transform Your Business?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams already using Mindsync Work to streamline their operations and accelerate growth
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-red-500 text-lg px-8 py-4 rounded-xl shadow-lg font-medium transition-all duration-300 text-white"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScheduleDemo}
              className="border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-purple-200 text-lg px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-purple-500/10"
            >
              Schedule Demo
            </motion.button>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 text-center text-sm text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              No credit card required
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              14-day free trial
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              Cancel anytime
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-700 bg-gray-900">
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

export default LandingPage;
