import React from 'react';

const MorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">More</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">
            Additional features and settings will be available here.
          </p>
          <div className="mt-6 space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900">MindSync AI</h3>
              <p className="text-gray-600 text-sm">AI-powered assistance for your workflow</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900">Settings</h3>
              <p className="text-gray-600 text-sm">Customize your workspace preferences</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900">Help & Support</h3>
              <p className="text-gray-600 text-sm">Get help and contact support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MorePage;
