import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';
import AccountTypeSelectionPage from './pages/AccountTypeSelectionPage';
import GetStartedPage from './pages/GetStartedPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import OnboardingIntroPage from './pages/OnboardingIntroPage';

// New comprehensive onboarding flow
import UserTypeSelectionPage from './pages/UserTypeSelectionPage';
import UserDetailsOnboardingPage from './pages/UserDetailsOnboardingPage';
import CompanySetupOnboardingPage from './pages/CompanySetupOnboardingPage';
import RoleAssignmentOnboardingPage from './pages/RoleAssignmentOnboardingPage';
import TeamInvitationsOnboardingPage from './pages/TeamInvitationsOnboardingPage';
import WorkspaceCreationOnboardingPage from './pages/WorkspaceCreationOnboardingPage';
import TemplateSelectionOnboardingPage from './pages/TemplateSelectionOnboardingPage';
import TeamMemberJoinPage from './pages/TeamMemberJoinPage';
import IndividualSetupPage from './pages/IndividualSetupPage';

// Legacy onboarding pages (keeping for backward compatibility)
import RoleSelectionPage from './pages/RoleSelectionPage';
import TeamSizePage from './pages/TeamSizePage';
import ManagementCategoryPage from './pages/ManagementCategoryPage';
import FocusAreaPage from './pages/FocusAreaPage';
import SurveyPage from './pages/SurveyPage';
import ViewLayoutPage from './pages/ViewLayoutPage';
import TeamInvitePage from './pages/TeamInvitePage';
import BoardSetupPage from './pages/BoardSetupPage';
import ProjectSetupPage from './pages/ProjectSetupPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import WorkspaceCustomizationPage from './pages/WorkspaceCustomizationPage';
import DashboardWidgetsPage from './pages/DashboardWidgetsPage';
import DashboardPage from './pages/DashboardPage';
import GlassDashboardPage from './pages/GlassDashboardPage';
import CreateTaskPage from './pages/CreateTaskPage';
import WorkspacePage from './pages/WorkspacePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page - Default route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Demo Page */}
          <Route path="/demo" element={<DemoPage />} />
          
          {/* Account Type Selection */}
          <Route path="/account-type" element={<AccountTypeSelectionPage />} />
          
          {/* Registration Page */}
          <Route path="/register" element={<GetStartedPage />} />
          
          {/* Get Started Page (legacy) */}
          <Route path="/get-started" element={<GetStartedPage />} />
          
          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* New Comprehensive Onboarding Flow */}
          {/* Organization Flow: user-details → company-setup → workspace-creation → template-selection */}
          {/* Personal Flow: individual-setup → template-selection */}
          <Route path="/onboarding/user-type" element={<UserTypeSelectionPage />} />
          <Route path="/onboarding/user-details" element={<UserDetailsOnboardingPage />} />
          <Route path="/onboarding/company-setup" element={<CompanySetupOnboardingPage />} />
          <Route path="/onboarding/role-assignment" element={<RoleAssignmentOnboardingPage />} />
          <Route path="/onboarding/team-invitations" element={<TeamInvitationsOnboardingPage />} />
          <Route path="/onboarding/workspace-creation" element={<WorkspaceCreationOnboardingPage />} />
          <Route path="/onboarding/template-selection" element={<TemplateSelectionOnboardingPage />} />
          <Route path="/onboarding/team-member-join" element={<TeamMemberJoinPage />} />
          <Route path="/onboarding/individual-setup" element={<IndividualSetupPage />} />
          
          {/* Legacy Onboarding Pages (keeping for backward compatibility) */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/onboarding-intro" element={<OnboardingIntroPage />} />
          
          {/* Role Selection Page */}
          <Route path="/role-selection" element={<RoleSelectionPage />} />
        
        {/* Team Size Page */}
        <Route path="/team-size" element={<TeamSizePage />} />
        
        {/* Management Category Page */}
        <Route path="/management-category" element={<ManagementCategoryPage />} />
        
        {/* Focus Area Page */}
        <Route path="/focus-area" element={<FocusAreaPage />} />
        
        {/* Survey Page */}
        <Route path="/survey" element={<SurveyPage />} />
        
        {/* View Layout Page */}
        <Route path="/view-layout" element={<ViewLayoutPage />} />
        
        {/* Team Invite Page */}
        <Route path="/team-invite" element={<TeamInvitePage />} />
        
        {/* Board Setup Page - Board naming (first step) */}
        <Route path="/board-setup" element={<BoardSetupPage />} />
        
        {/* Template Selection Page - Choose template for board */}
        <Route path="/template-selection" element={<TemplateSelectionPage />} />
        <Route path="/templates" element={<TemplateSelectionPage />} />
        
        {/* Workspace Management - Individual workspace access */}
        <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
        <Route path="/workspace/:workspaceId/:parentId" element={<WorkspacePage />} />
        
        {/* Project Setup Page (legacy route) */}
        <Route path="/project-setup" element={<ProjectSetupPage />} />
        
        {/* Workspace Customization Page */}
        <Route path="/workspace-customization" element={<WorkspaceCustomizationPage />} />
        
        {/* Dashboard Widgets Page */}
        <Route path="/dashboard-widgets" element={<DashboardWidgetsPage />} />
        
        {/* Dashboard Page */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        <Route path="/dashboard" element={<Navigate to="/glass-dashboard" replace />} />
        
        {/* Glass Dashboard Page */}
        <Route path="/glass-dashboard" element={<GlassDashboardPage />} />
        
        {/* Create Task Page */}
        <Route path="/create-task" element={<CreateTaskPage />} />
        
        {/* Catch all other routes to landing page */}
        <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};export default App;