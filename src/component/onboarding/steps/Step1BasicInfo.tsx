import { type FC, useState } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import {
  INDUSTRIES,
  type BusinessStage,
  type RevenueRange,
  type TeamSize,
} from '../../../types/profile';

const STAGES: BusinessStage[] = [
  'Idea Stage',
  'Early Startup',
  'Growing Startup',
  'Established Business',
  'Scaling Company',
];

const REVENUE_RANGES: RevenueRange[] = [
  'Pre-revenue',
  'Under $50K',
  '$50K - $200K',
  '$200K - $500K',
  '$500K - $1M',
  '$1M - $5M',
  '$5M - $20M',
  '$20M+',
];

const TEAM_SIZES: TeamSize[] = [
  'Solo founder',
  '2 - 5',
  '6 - 20',
  '21 - 50',
  '51 - 200',
  '200+',
];

interface Props { onNext: () => void }

export const Step1BasicInfo: FC<Props> = ({ onNext }) => {
  const { profile, updateProfile } = useProfileStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!profile.businessName.trim()) e.businessName = 'Business name is required';
    if (!profile.founderName.trim())  e.founderName  = 'Your name is required';
    if (!profile.industry)            e.industry     = 'Please select an industry';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext();
  };

  return (
    <div className="animate-[fade-up_0.4s_ease-out_both] space-y-8">
      <div>
        <div className="label-tag">Step 1 of 5</div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">
          Tell us about your business
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          This helps IntelliAxis personalise every insight and recommendation
          to your specific context.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Business Name"
            placeholder="e.g. Acme Technologies"
            value={profile.businessName}
            onChange={(e) => updateProfile({ businessName: e.target.value })}
            error={errors.businessName}
          />
          <Input
            label="Your Name"
            placeholder="e.g. James Okafor"
            value={profile.founderName}
            onChange={(e) => updateProfile({ founderName: e.target.value })}
            error={errors.founderName}
          />
        </div>

        <Select
          label="Industry"
          value={profile.industry}
          options={INDUSTRIES}
          onChange={(v) => updateProfile({ industry: v })}
          placeholder="Select your industry"
          error={errors.industry}
        />

        <Input
          label="Sub-sector (optional)"
          placeholder="e.g. Mobile payments, B2B SaaS, Fast fashion"
          value={profile.subSector}
          onChange={(e) => updateProfile({ subSector: e.target.value })}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            label="Business Stage"
            value={profile.businessStage}
            options={STAGES}
            onChange={(v) => updateProfile({ businessStage: v as BusinessStage })}
          />
          <Select
            label="Annual Revenue"
            value={profile.revenueRange}
            options={REVENUE_RANGES}
            onChange={(v) => updateProfile({ revenueRange: v as RevenueRange })}
          />
        </div>

        {/* Team size pills */}
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Team Size
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEAM_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updateProfile({ teamSize: size })}
                className={`rounded-full border px-4 py-1.5 font-mono text-[11px] transition-all ${
                  profile.teamSize === size
                    ? 'border-cyan/60 bg-cyan/10 text-cyan'
                    : 'border-white/10 bg-surface text-textSecondary hover:border-white/20'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Continue →</Button>
      </div>
    </div>
  );
};