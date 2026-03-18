import { type FC, useState } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Textarea } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { GOAL_OPTIONS, type BusinessGoal } from '../../../types/profile';

interface Props { onNext: () => void; onBack: () => void }

export const Step2Goals: FC<Props> = ({ onNext, onBack }) => {
  const { profile, updateProfile } = useProfileStore();
  const [error, setError] = useState('');

  const toggleGoal = (goal: BusinessGoal) => {
    const current = profile.goals;
    const updated = current.includes(goal)
      ? current.filter((g) => g !== goal)
      : [...current, goal];
    updateProfile({ goals: updated });
  };

  const handleNext = () => {
    if (profile.goals.length === 0) {
      setError('Please select at least one goal');
      return;
    }
    onNext();
  };

  return (
    <div className="animate-[fade-up_0.4s_ease-out_both] space-y-8">
      <div>
        <div className="label-tag">Step 2 of 5</div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">
          What are your business goals?
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          Select all that apply. IntelliAxis will prioritise recommendations that move these needles.
        </p>
      </div>

      <div className="space-y-6">
        {/* Goal pills */}
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Select your goals (pick all that apply)
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((goal) => {
              const active = profile.goals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => { toggleGoal(goal); setError(''); }}
                  className={`rounded-full border px-4 py-2 text-[12px] transition-all ${
                    active
                      ? 'border-cyan/60 bg-cyan/10 text-cyan'
                      : 'border-white/10 bg-surface text-textSecondary hover:border-white/20 hover:text-textPrimary'
                  }`}
                >
                  {active && <span className="mr-1.5">✓</span>}
                  {goal}
                </button>
              );
            })}
          </div>
          {error && <p className="mt-2 text-[11px] text-danger">{error}</p>}
        </div>

        {/* Biggest challenge */}
        <Textarea
          label="What is your biggest challenge right now?"
          placeholder="e.g. We are struggling to acquire customers profitably. Our CAC is too high and we haven't found a scalable channel yet."
          rows={4}
          value={profile.biggestChallenge}
          onChange={(e) => updateProfile({ biggestChallenge: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext}>Continue →</Button>
      </div>
    </div>
  );
};