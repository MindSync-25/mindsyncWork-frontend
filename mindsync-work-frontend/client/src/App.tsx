import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DemoPage from './pages/DemoPage';
import GetStartedPage from './pages/GetStartedPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import OnboardingIntroPage from './pages/OnboardingIntroPage';
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
import CreateTaskPage from './pages/CreateTaskPage';
import WorkspacesPage from './pages/WorkspacesPage';
import WorkspacePage from './pages/WorkspacePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page - Default route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Demo Page */}
        <Route path="/demo" element={<DemoPage />} />
        
        {/* Get Started Page */}
        <Route path="/get-started" element={<GetStartedPage />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Onboarding Page */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        {/* Onboarding Intro Page - Explains the onboarding process */}
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
        
        {/* Workspace Management */}
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
        <Route path="/workspace/:workspaceId/:parentId" element={<WorkspacePage />} />
        
        {/* Project Setup Page (legacy route) */}
        <Route path="/project-setup" element={<ProjectSetupPage />} />
        
        {/* Workspace Customization Page */}
        <Route path="/workspace-customization" element={<WorkspaceCustomizationPage />} />
        
        {/* Dashboard Widgets Page */}
        <Route path="/dashboard-widgets" element={<DashboardWidgetsPage />} />
        
        {/* Dashboard Page */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Create Task Page */}
        <Route path="/create-task" element={<CreateTaskPage />} />
        
        {/* Catch all other routes to landing page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;