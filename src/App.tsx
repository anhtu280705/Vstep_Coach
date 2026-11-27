import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Layout/Sidebar';
import { DragonBackdrop } from './components/Layout/DragonBackdrop';
import { DashboardView } from './components/Dashboard/DashboardView';

const VocabView = lazy(() =>
  import('./components/Vocab/VocabView').then((m) => ({ default: m.VocabView }))
);
const GrammarView = lazy(() =>
  import('./components/Grammar/GrammarView').then((m) => ({ default: m.GrammarView }))
);
const SkillsView = lazy(() =>
  import('./components/Skills/SkillsView').then((m) => ({ default: m.SkillsView }))
);
const SettingsView = lazy(() =>
  import('./components/Settings/SettingsView').then((m) => ({ default: m.SettingsView }))
);
const AuthModal = lazy(() =>
  import('./components/Auth/AuthModal').then((m) => ({ default: m.AuthModal }))
);

const TabFallback: React.FC = () => (
  <div className="flex items-center justify-center py-20 text-sm text-slate-400 dark:text-slate-500">
    Đang tải...
  </div>
);

const AppContent: React.FC = () => {
  const { activeTab, state } = useApp();
  const { authModalOpen } = useAuth();

  return (
    <div
      className={`relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row ${
        state.settings.showDragon ? 'dragon-decor-active' : ''
      }`}
    >
      <DragonBackdrop />
      <Sidebar />
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      )}
      <main className="relative z-10 flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab !== 'dashboard' && (
            <Suspense fallback={<TabFallback />}>
              {activeTab === 'vocab' && <VocabView />}
              {activeTab === 'grammar' && <GrammarView />}
              {activeTab === 'skills' && <SkillsView />}
              {activeTab === 'settings' && <SettingsView />}
            </Suspense>
          )}
        </div>
      </main>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
