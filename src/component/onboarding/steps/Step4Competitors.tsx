import { type FC, useState, type KeyboardEvent } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Textarea } from '../../ui/Input';
import { Button } from '../../ui/Button';

interface Props { onNext: () => void; onBack: () => void }

export const Step4Competitors: FC<Props> = ({ onNext, onBack }) => {
  const { profile, updateProfile } = useProfileStore();
  const [draft, setDraft] = useState('');

  const addCompetitor = () => {
    const trimmed = draft.trim();
    if (trimmed && !profile.competitors.includes(trimmed)) {
      updateProfile({ competitors: [...profile.competitors, trimmed] });
    }
    setDraft('');
  };

  const removeCompetitor = (name: string) => {
    updateProfile({ competitors: profile.competitors.filter((c) => c !== name) });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addCompetitor(); }
    if (e.key === 'Backspace' && draft === '' && profile.competitors.length > 0) {
      removeCompetitor(profile.competitors[profile.competitors.length - 1]);
    }
  };

  return (
    <div className="animate-[fade-up_0.4s_ease-out_both] space-y-8">
      <div>
        <div className="label-tag">Step 4 of 5</div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">
          Who are your competitors?
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          IntelliAxis will track these companies and alert you to their moves. You can add more later.
        </p>
      </div>

      <div className="space-y-6">
        {/* Tag input */}
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Competitor Names
          </label>
          <div className="mt-2 flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-surface2 px-3 py-2.5 transition-colors focus-within:border-cyan/40">
            {profile.competitors.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-[10px] text-cyan"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeCompetitor(c)}
                  className="text-cyan/50 hover:text-cyan leading-none"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addCompetitor}
              placeholder={profile.competitors.length === 0 ? 'e.g. Paystack, Flutterwave, Stripe…' : ''}
              className="min-w-[160px] flex-1 bg-transparent text-sm text-textPrimary placeholder-textSecondary/40 outline-none"
            />
          </div>
          <p className="mt-1.5 text-[10px] text-textSecondary">
            Press Enter or comma to add · Backspace to remove last
          </p>
        </div>

        {/* Unique advantage */}
        <Textarea
          label="What is your unique competitive advantage?"
          placeholder="e.g. We are the only platform that combines real-time intelligence with actionable strategy recommendations specifically for African SMEs."
          rows={4}
          value={profile.uniqueAdvantage}
          onChange={(e) => updateProfile({ uniqueAdvantage: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={onNext}>Continue →</Button>
      </div>
    </div>
  );
};