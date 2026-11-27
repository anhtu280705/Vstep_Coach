import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { DragonBackdrop } from './components/Layout/DragonBackdrop';
import { AuthModal } from './components/Auth/AuthModal';
import { DashboardView } from './components/Dashboard/DashboardView';
import { VocabView } from './components/Vocab/VocabView';
import { GrammarView } from './components/Grammar/GrammarView';
import { SkillsView } from './components/Skills/SkillsView';
import { SettingsView } from './components/Settings/SettingsView';

const AppContent: React.FC = () => {
  const { activeTab, state } = useApp();

  return (
    <div
      className={`relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row ${
        state.settings.showDragon ? 'dragon-decor-active' : ''
      }`}
    >
      <DragonBackdrop />
      <Sidebar />
      <AuthModal />
      <main className="relative z-10 flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'vocab' && <VocabView />}
          {activeTab === 'grammar' && <GrammarView />}
          {activeTab === 'skills' && <SkillsView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
