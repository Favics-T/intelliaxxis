import { type FC, useState } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Textarea } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import type { TargetMarket } from '../../../types/profile';

const MARKETS: TargetMarket[] = [
  'Local', 'National', 'Africa', 'Europe', 'North America', 'Asia', 'Global',
];

const GEOGRAPHIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt',
  'United Kingdom', 'United States', 'Canada', 'India', 'UAE', 'Other',
];

interface Props { onNext: () => void; onBack: () => void }

export const Step3Market: FC<Props> = ({ onNext, onBack }) => {
  const { profile, updateProfile } = useProfileStore();
  const [error, setError] = useState('');

  const toggleGeo = (geo: string) => {
    const updated = profile.geographies.includes(geo)
      ? profile.geographies.filter((g) => g !== geo)
      : [...profile.geographies, geo];
    updateProfile({ geographies: updated });
  };

  const handleNext = () => {
    if (!profile.targetMarket) {
      setError('Please select a target market');
      return;
    }
    onNext();
  };

  return (
    <div className="animate-[fade-up_0.4s_ease-out_both] space-y-8">
      <div>
        <div className="label-tag">Step 3 of 5</div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">
          Who is your market?
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          This tells IntelliAxis which regional signals, regulations, and
          trends are relevant to you.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Select
            label="Market Scope"
            value={profile.targetMarket}
            options={MARKETS}
            onChange={(v) => {
              updateProfile({ targetMarket: v as TargetMarket });
              setError('');
            }}
            placeholder="Select your target market"
          />
          {error && <p className="mt-1.5 text-[11px] text-danger">{error}</p>}
        </div>

        {/* Geographies */}
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Key Geographies (select all relevant)
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {GEOGRAPHIES.map((geo) => {
              const active = profile.geographies.includes(geo);
              return (
                <button
                  key={geo}
                  type="button"
                  onClick={() => toggleGeo(geo)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] transition-all ${
                    active
                      ? 'border-violet/60 bg-violet/10 text-violet'
                      : 'border-white/10 bg-surface text-textSecondary hover:border-white/20'
                  }`}
                >
                  {active && <span className="mr-1">✓</span>}
                  {geo}
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          label="Describe your ideal customer"
          placeholder="e.g. Small business owners aged 28-45 in Lagos who run product-based businesses and are looking to scale online."
          rows={4}
          value={profile.customerDescription}
          onChange={(e) => updateProfile({ customerDescription: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext}>Continue →</Button>
      </div>
    </div>
  );
};