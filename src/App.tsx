import type { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './component/layout/AppShell';
import { OnboardingPage } from './pages/Onbaording';
import { DashboardPage } from './pages/Dashboard';
import { IntelligencePage } from './pages/Intelligence';
import { StrategyPage } from './pages/Strategy';
import { ResearchPage } from './pages/Reasearch';
import { DigestPage } from './pages/Digest';
import { CompetitorsPage } from './pages/Competitor';
import { ProfilePage } from './pages/Profile';
import { useProfileStore } from './store/profileStore';

const App: FC = () => {
  const { hasCompletedOnboarding } = useProfileStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding — shown if profile not complete */}
        <Route
          path="/onboarding"
          element={
            hasCompletedOnboarding
              ? <Navigate to="/dashboard" replace />
              : <OnboardingPage />
          }
        />

        {/* App — protected by onboarding check */}
        <Route
          path="/"
          element={
            hasCompletedOnboarding
              ? <AppShell />
              : <Navigate to="/onboarding" replace />
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"    element={<DashboardPage />} />
          <Route path="intelligence" element={<IntelligencePage />} />
          <Route path="strategy"     element={<StrategyPage />} />
          <Route path="research"     element={<ResearchPage />} />
          <Route path="digest"       element={<DigestPage />} />
          <Route path="competitors"  element={<CompetitorsPage />} />
          <Route path="profile"      element={<ProfilePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;