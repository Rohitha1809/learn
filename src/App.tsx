/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import DomainsView from './components/DomainsView';
import CourseDetailView from './components/CourseDetailView';
import DashboardView from './components/DashboardView';
import CreateContentView from './components/CreateContentView';
import AdminView from './components/AdminView';
import AuthView from './components/AuthView';

function AppContent() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-[#070d19] text-white selection:bg-[#4be277]/30 selection:text-white antialiased">
      {/* Premium Glass Top Nav */}
      <Navbar />

      {/* Main Container View Switcher */}
      <main className="w-full">
        {currentView === 'home' && <HomeView />}
        {currentView === 'domains' && <DomainsView />}
        {currentView === 'course' && <CourseDetailView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'create' && <CreateContentView />}
        {currentView === 'admin' && <AdminView />}
        {currentView === 'auth' && <AuthView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

