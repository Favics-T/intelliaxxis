import { useState, type FC } from 'react';
import { useProfileStore } from '../../store/profileStore';
import { Step1BasicInfo } from './steps/Step1BasicInfo';
import { Step2Goals } from './steps/Step2Goals';
import { Step3Market } from './steps/Step3Market';
import { Step4Competitors } from './steps/Step4Competitors';
import { Step5Description } from './steps/Step5Description';

const STEPS = [
  { number: 1, label: 'Business Info' },
  { number: 2, label: 'Goals'         },
  { number: 3, label: 'Market'        },
  { number: 4, label: 'Competitors'   },
  { number: 5, label: 'Description'   },
];

export const OnboardingWizard: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { completeOnboarding } = useProfileStore();

  const next = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const finish = () => completeOnboarding();

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/30 font-mono text-xs text-cyan font-bold">
              IX
            </span>
            <span className="font-mono text-sm tracking-[0.06em] text-textPrimary">
              IntelliAxis
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Step {currentStep} of 5
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-surface2">
        <div
          className="h-full bg-cyan transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          {STEPS.map((step) => (
            <div key={step.number} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px] transition-all ${
                  step.number < currentStep
                    ? 'border-emerald bg-emerald/15 text-emerald'
                    : step.number === currentStep
                    ? 'border-cyan bg-cyan/10 text-cyan'
                    : 'border-white/10 bg-surface2 text-textSecondary'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span
                className={`hidden text-[11px] sm:block ${
                  step.number === currentStep
                    ? 'text-textPrimary'
                    : 'text-textSecondary'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto max-w-2xl">
          {currentStep === 1 && <Step1BasicInfo onNext={next} />}
          {currentStep === 2 && <Step2Goals onNext={next} onBack={back} />}
          {currentStep === 3 && <Step3Market onNext={next} onBack={back} />}
          {currentStep === 4 && <Step4Competitors onNext={next} onBack={back} />}
          {currentStep === 5 && <Step5Description onFinish={finish} onBack={back} />}
        </div>
      </div>
    </div>
  );
};