import type { FC } from 'react'
import { OnboardingWizard } from '../component/onboarding/OnboardingWizard';
// import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { DEMO_PROFILE, DEMO_SIGNALS, DEMO_RECOMMENDATIONS } from '../utils/demoData';
import { useNavigate } from 'react-router-dom';

export const OnboardingPage: FC = () => {
  const { updateProfile, completeOnboarding } = useProfileStore();
  const { setSignals, setRecommendations }    = useIntelligenceStore();
  const navigate = useNavigate();

  const loadDemo = () => {
    updateProfile(DEMO_PROFILE);
    completeOnboarding();
    setSignals(DEMO_SIGNALS);
    setRecommendations(DEMO_RECOMMENDATIONS);
    navigate('/dashboard');
  };

  return (
    <div className="relative">
      <OnboardingWizard />

      {/* Demo button — for presentation */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={loadDemo}
          className="rounded-full border border-cyan/30 bg-surface/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan shadow-xl backdrop-blur-sm transition-all hover:border-cyan hover:bg-cyan/10"
        >
          ⚡ Load Demo
        </button>
      </div>
    </div>
  );
};